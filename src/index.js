import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { View, AppState } from 'react-native';

import styles from './styles';
import { getInit, getEnd, flattenObject } from './helpers';

class Chart extends Component {
  constructor(props) {
    super(props);
    this.webViewRef = React.createRef();
    this.state = { key: 0 };
  }

  componentDidMount() {
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      this.reflowCharts();
    }
  };

  reflowCharts = () => {
    const reflowScript = `
      (function(){
        try {
          if (window.Highcharts && window.Highcharts.charts) {
            window.Highcharts.charts.forEach(function(chart) {
              if (chart && chart.reflow) {
                chart.reflow();
              }
            });
          }
        } catch(e) {
          console.log('Highcharts reflow error:', e);
        }
      })();
      true;
    `;
    
    if (this.webViewRef.current) {
      this.webViewRef.current.injectJavaScript(reflowScript);
    }
  };

  handleContentProcessTerminate = () => {
    if (this.webViewRef.current) {
      this.webViewRef.current.reload();
    }
  };

  handleRenderProcessGone = (event) => {
    this.setState({ key: this.state.key + 1 });
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.nameForReload !== nextProps.nameForReload) || (this.state.key !== nextState.key);
  }

  render() {
    let config = JSON.stringify(this.props.config, (_, value) => {
      //create string of json but if it detects function it uses toString()
      return typeof value === 'function' ? value.toString() : value;
    });

    config = JSON.parse(config);
    const concatHTML = `${getInit(this.props)}${flattenObject(config)}${getEnd()}`;

    return (
      <View style={this.props.style}>
        <WebView
          key={this.state.key}
          ref={this.webViewRef}
          style={styles.full}
          source={{ html: concatHTML, baseUrl: 'web/' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          scrollEnabled={false}
          automaticallyAdjustContentInsets={true}
          onContentProcessDidTerminate={this.handleContentProcessTerminate}
          onRenderProcessGone={this.handleRenderProcessGone}
          {...this.props}
        />
      </View>
    );
  }
}

export default function ChartContainer(props) {
  return <Chart {...props} />
}
