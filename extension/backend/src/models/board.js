import mongoose from 'mongoose';
import _ from 'lodash';

import { Resolver } from 'graphql-compose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { composeWithAuth } from '../graphql/composeWithAuth';

import { AddImageUpload } from '../util/graphqlUploads';

import { BiteTC } from './bite';
import { UserTC } from './user';
import { ImageTC } from './image';

import { VisibilityEnumTC } from './types/visibility';
import { AudienceRatingEnumTC } from './types/audienceRating';

import { LogAction } from '../util';

var BoardSchema = new mongoose.Schema(
{
	ownerId:
	{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		description: 'User who created Board',
		index: true
	},
	title:
	{
		type: String,
		description: 'Title of Board.',
		validate: {
			validator: function(v) {
				return /^[\s\S]{1,60}$/i.test(v);
			},
			message: '{VALUE} is not a valid title. Must be less than 60 characters.'
		},
	},
	description:
	{
		type: String,
		description: 'Description of the board.',
		validate: {
			validator: function(v) {
				return /^[\s\S]{1,140}$/i.test(v);
			},
			message: '{VALUE} is not a valid description. Must be less than 140 characters and only use valid characters and punctuation (!,.,?)'
		},
	},
	color:
	{
		type: String,
		validate: {
			validator: function(v) {
				return /^#[a-zA-Z0-9]{6}$/.test(v);
			},
			message: '{VALUE} is not a valid color.'
		},
		description: 'Primary color of the Board represented in six-digit HEX (eg. #A1B2C3). Should be used as a background visual fallback when image is unavalible.'
	},
	imageId:
	{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Image',
		description: 'Image associated with the board. This will be overriden when creating or updating by the Image argument.'
	},
	userKeywords: {
		type: [String],
		description: 'Keywords associated with Board',
		required: true
	},
	keywords: {
		type: [String],
		description: 'Keywords associated with Board',
		required: true
	},
	visibility: {
		type: String,
		enum: ['PUBLIC', 'PRIVATE', 'UNLISTED', 'HIDDEN', 'BLOCKED'],
		default: 'PUBLIC',
		description: 'Visibility level of Bite'
	},
	audienceRating: {
		type: String,
		enum: ['G', 'PG', 'PG13', 'R', 'NC17'],
		default: 'PG13',
		description: 'MPAA Ratings standards for sound bites.'
	},
	biteIds:
	{
		type: [{type: mongoose.Schema.Types.ObjectId, ref:'Bite'}],
		description: 'Bite ids that belong to the board.',
		index: true
	},
	keycodes:
	{
		type: [Number],
		description: 'Hotkeys that map to the board of bites.'
	}
},
{
  timestamps: true
});

BoardSchema.index({"createdAt": 1});

BoardSchema.pre('save', async function(next) {
	// Update on elk.
	await elasticsearch.index({
		index: 'boards',
		type: 'board',
		id: this._id.toString(),
		body: _.omit(this.toObject(), ["_id"])
	});

  if(!this.isNew) return next();
	await this.model('User').update({_id: this.ownerId}, { $addToSet: { boardIds: this._id  } });
  return next();
});

BoardSchema.pre('remove', async function(next) {
	await this.model('User').update({_id: this.ownerId}, { $pull: { boardIds: this._id  } });
  return next();
});

const customizationOptions = {
  name: "Board",
  description: "Board is a finite collection of bites with hotkeys..",
	resolvers: {
		createOne: {
			record: {
				removeFields: ['createdAt', 'updatedAt', '_id']
			},
		},
		updateById:
		{
			record: {
				removeFields: ['createdAt', 'updatedAt', 'imageId']
			}
		}
	}
};

export const Board = mongoose.model('Board', BoardSchema);
export const BoardTC = composeWithMongoose(Board, customizationOptions);
composeWithAuth(BoardTC);

AddImageUpload({
	typeComposer: BoardTC,
	populateField: 'imageId',
	description: 'The main image of the board.',
	resolvers: [
		BoardTC.getResolver('createOne'),
		BoardTC.getResolver('updateById')
	]
});

BoardTC.extendField('visibility', {
  type: VisibilityEnumTC
})

BoardTC.extendField('audienceRating', {
  type: AudienceRatingEnumTC
})

BoardTC.addRelation(
  'image',
  {
    resolver: () => ImageTC.getResolver('findById'),
    prepareArgs: {
      _id: source => source.imageId
    },
    projection: { imageId: true },
    description: 'Image associated with the board.'
  }
);

BoardTC.addRelation(
  'biteObjects',
  {
    resolver: new Resolver({
			name: "boardBites",
			type: [BiteTC],
			resolve: async (req) => {
				let bites = await BiteTC.getResolver('findByIds').resolve(req);
				return _.map(req.source.biteIds, (id) => {
					return _.find(bites, {_id: id});
				});
			}
		}),
    prepareArgs: {
      _ids: source => source.biteIds || [],
    },
    projection: { biteIds: true },
    description: 'Bites of the board.'
  }
);

BoardTC.addRelation(
  'ownerObject',
  {
    resolver: () => UserTC.getResolver('findById'),
    prepareArgs: {
      _id: source => source.ownerId,
    },
    projection: { ownerId: true },
    description: 'User the board belongs to.'
  }
);

BoardTC.addResolver(new Resolver({
	name: "setBite",
	type: BoardTC,
	args: {
		_id: "MongoID!",
		index: "Int!",
		bite: "MongoID"
	},
	resolve: async ({ args }) => {
		if (args.index < 0 || args.index > 23) throw new Error("Index out of bounds. 0 <= index <= 23.");
		await Board.update({ _id: args._id }, { $set: { [`biteIds.${args.index}`]: args.bite } });
		return await Board.findOne({ _id: args._id });
	}
}));

BoardTC.wrapResolverResolve('setBite', next => (req) => {
  LogAction({
		req,
		action: 'BOARD_SET_BITE',
		serverData: {
			biteId: req.args.bite,
			boardId: req.args._id
		}
	});
  return next(req);
});

BoardTC.addResolver(new Resolver({
	name: "setHotkey",
	type: BoardTC,
	args: {
		_id: "MongoID!",
		index: "Int!",
		key: "Int"
	},
	resolve: async ({ source, args, context, info }) => {
		if (args.index < 0 || args.index > 23) throw new Error("Index out of bounds. 0 <= index <= 23.");
		await Board.update({ _id: args._id }, { $set: { [`keycodes.${args.index}`]: args.key } });
		return await Board.findOne({ _id: args._id });
	}
}));

BoardTC.addResolver(new Resolver({
  name: 'randomMany',
  type: [BoardTC],
  args: {
    limit: { type: "Int", defaultValue: 20, description: 'Number of random boards to find. Max: 100. Min: 1.' }
  },
  resolve: async ({ source, args, context, info }) => {
    // Make sure limit is within bounds.
    args.limit = Math.min(100, args.limit);
    args.limit = Math.max(1, args.limit);
    return await Board.aggregate([
      { $match : { visibility: 'PUBLIC' } },
      { $sample: { size: args.limit } }
    ]);
  }
}));
