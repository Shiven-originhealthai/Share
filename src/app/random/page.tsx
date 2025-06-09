"use client";
import React, { useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

export default function random() {
    const elementRef = useRef(null);
    const imageUrl: string = '/dicoms/image-000001.dcm'
    if (typeof (window) !== 'undefined') {
        console.log(window.innerWidth);

    }

    useEffect(() => {
        if (!elementRef.current) return;

        // Initialize Cornerstone
        cornerstone.enable(elementRef.current);

        // Image loader configuration
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

        // Load and display the image
        const loadImage = async () => {
            try {
                const image = await cornerstone.loadImage(imageUrl);
                cornerstone.displayImage(elementRef.current, image);
            } catch (error) {
                console.error('Error loading image:', error);
            }
        };

        loadImage();

        return () => {
            cornerstone.disable(elementRef.current);
        };
    }, [imageUrl]);
}