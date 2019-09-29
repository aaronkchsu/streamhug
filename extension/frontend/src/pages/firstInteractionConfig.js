import React, {Suspense} from 'react';
const Config = React.lazy(() => import(/* webpackPrefetch: true */ './config'));

import FirstScreenInteraction from '../components/FirstScreenInteractionConfig';

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
            showingFirstInteractionScreen: false
        };
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
            <Suspense fallback={<div style={loadingStyle}></div>}>
                <Config {...this.props} isOverlay={false} logAction={this.props.logAction} client={this.props.client} />
            </Suspense>
        );
    }
}

export default Page;
