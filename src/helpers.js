import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

export const getInit = (props) => `<html>
                                    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />
                                    <style media="screen" type="text/css">
                                    #container {
                                        width:100%;
                                        height:100%;
                                        top:0;
                                        left:0;
                                        right:0;
                                        bottom:0;
                                        position:absolute;
                                        user-select: none;
                                        -webkit-user-select: none;
                                    }
                                    </style>
                                    <head>
                                        ${
                                          props.stock
                                            ? (Platform.OS === 'ios' ? `<script type='text/javascript' src="${RNFS.MainBundlePath}/assets/resources/images/highstock.js"></script>`
                                              : `<script type='text/javascript' src="file:///android_asset/js/highstock.js"></script>`)
                                            : (Platform.OS === 'ios' ? `<script type='text/javascript' src="${RNFS.MainBundlePath}/assets/resources/images/highcharts.js"></script>`
                                              : `<script type='text/javascript' src="file:///android_asset/js/highcharts.js"></script>`)
                                        }
                                        ${
                                          props.more
                                            ? (Platform.OS === 'ios' ? `<script type='text/javascript' src="${RNFS.MainBundlePath}/assets/resources/images/highcharts-more.js"></script>`
                                              : `<script type='text/javascript' src="file:///android_asset/js/highcharts-more.js"></script>`)
                                            : ''
                                        }
                                        ${
                                          props.enableVariablePie
                                            ? (Platform.OS === 'ios' ? `<script type='text/javascript' src="${RNFS.MainBundlePath}/assets/resources/images/variable-pie.js"></script>`
                                              : `<script type='text/javascript' src="file:///android_asset/js/variable-pie.js"></script>`)
                                            : ''
                                        }
                                        ${
                                          props.guage
                                            ? (Platform.OS === 'ios' ? `<script type='text/javascript' src="${RNFS.MainBundlePath}/assets/resources/images/solid-gauge.js"></script>`
                                              : `<script type='text/javascript' src="file:///android_asset/js/solid-gauge.js"></script>`)
                                            : ''
                                        }
                                        ${Platform.OS === 'ios' ? `<script type='text/javascript' src="${RNFS.MainBundlePath}/assets/resources/images/exporting.js"></script>`
                                              : `<script type='text/javascript' src="file:///android_asset/js/exporting.js"></script>`}
                                        <script>
                                        document.addEventListener("DOMContentLoaded", function(event) {
                                            Highcharts.setOptions(${JSON.stringify(
                                              props.options
                                            )});
                                            Highcharts.${
                                              props.stock
                                                ? 'stockChart'
                                                : 'chart'
                                            }('container', `;

export const getEnd = () => `           );
                                    });
                                    </script>
                                </head>
                                <body>
                                    <div id="container">
                                    </div>
                                </body>
                            </html>`;

export const flattenObject = (obj, str = '{') => {
  Object.keys(obj).forEach((key) => {
    str += `${key}: ${flattenText(obj[key])}, `;
  });
  return `${str.slice(0, str.length - 2)}}`;
};

export const flattenText = (item, key) => {
  if (key == 'y') console.log(item, typeof item);
  let str = '';
  if (item && typeof item === 'object' && item.length == undefined) {
    str += flattenObject(item);
  } else if (item && typeof item === 'object' && item.length !== undefined) {
    str += '[';
    item.forEach(function (k2) {
      str += `${flattenText(k2)}, `;
    });
    if (item.length > 0) str = str.slice(0, str.length - 2);
    str += ']';
  } else if (typeof item === 'string' && item.slice(0, 8) === 'function') {
    str += `${item}`;
  } else if (typeof item === 'string') {
    str += `\"${item.replace(/"/g, '\\"')}\"`;
  } else {
    str += `${item}`;
  }
  return str;
};
