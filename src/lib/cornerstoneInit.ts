import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import cornerstoneMath from 'cornerstone-math';
import dicomParser from 'dicom-parser';
import Hammer from 'hammerjs';

export function initializeCornerstone() {
  // Link cornerstone dependencies
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
  cornerstoneTools.external.Hammer = Hammer;

  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneWADOImageLoader.external.cornerstoneMath = cornerstoneMath;

  cornerstoneWADOImageLoader.configure({
    useWebWorkers: true,
    webWorkerPath: '/cornerstone/worker.js',
  });

  // Initialize cornerstone tools
  cornerstoneTools.init({
    showSVGCursors: true,
  });
}