"use client"; // If you're using Next.js App Router

import React, { useEffect, useRef } from "react";

const CameraFeed = ({ camera = true }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const getCameraFeed = async () => {
      try {
        if (camera) {
          // Start camera if camera prop is true
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        // Force video to pause and reset
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };

    if (camera) {
      getCameraFeed();
    } else {
      // Stop camera immediately when camera prop is false
      stopCamera();
    }

    // Cleanup when component unmounts
    return () => {
      stopCamera();
    };
  }, [camera]); // Re-run effect when camera prop changes

  return (
    <div className="flex justify-center items-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-xl shadow-md w-full max-w-md"
      />
    </div>
  );
};

export default CameraFeed;