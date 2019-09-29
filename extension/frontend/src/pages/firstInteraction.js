import React, {Suspense} from 'react';
const Panel = React.lazy(() => import(/* webpackPrefetch: true */ './panel'));

import FirstScreenInteraction from '../components/FirstScreenInteraction';
import Authentication from '../util/Authentication/Authentication';

const loadingStyle = {
    headerText: '#21000C',
    fontSize: "20px",
    backgroundColor: "#F3F3F3",
    minHeight: "480px",
    width: "100%",
    height: "100%",
    textAlign: "center",
    padding: "12px"
};

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showingFirstInteractionScreen: true
        };
        this.authNetwork = new Authentication();
    }

    onCloseFirstInteractionScreen = () => {
        this.setState({ showingFirstInteractionScreen: false })
    }

    render() {
        if (this.state.showingFirstInteractionScreen) {
            return <FirstScreenInteraction
                onCloseClick={this.onCloseFirstInteractionScreen}
                isOverlay={false}
            />
        }

        return (
            <Suspense fallback={<div style={loadingStyle}>Loading...</div>}>
                <Panel isOverlay={false} logAction={this.props.logAction} client={this.props.client} />
            </Suspense>
        );
    }
}

export default Page;
