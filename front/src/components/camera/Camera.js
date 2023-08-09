import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import cv from "@techstark/opencv-js";
import { Tensor, InferenceSession } from "onnxruntime-web";
import Loader from "./components/loader";
import { detectImage } from "./utils/detect";
import { download } from "./utils/download";
import "./style/App.css";
import Detectdata from "./Detectdata";

const Camera = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState({
    text: "Loading OpenCV.js",
    progress: null,
  });
  const [image, setImage] = useState(null);
  const inputImage = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const webcamRef = useRef(null); // Reference to the webcam component
  const [detecting, setDetecting] = useState(false); // State to control automatic detection
  const [lastCapturedImage, setLastCapturedImage] = useState(null);
  const [webcamActive, setWebcamActive] = useState(true);

  // Configs
  const modelName = "best.onnx";
  const modelInputShape = [1, 3, 320, 320];
  const topk = 100;
  const iouThreshold = 0.45;
  const scoreThreshold = 0.25;
  const detectionInterval = 1000;

  // wait until opencv.js initialized
  cv["onRuntimeInitialized"] = async () => {
    const baseModelURL = `${process.env.PUBLIC_URL}/model`;

    // create session
    const arrBufNet = await download(
      `${baseModelURL}/${modelName}`, // url
      ["Loading YOLOv8 Segmentation model", setLoading] // logger
    );
    const yolov8 = await InferenceSession.create(arrBufNet);
    const arrBufNMS = await download(
      `${baseModelURL}/nms-yolov8.onnx`, // url
      ["Loading NMS model", setLoading] // logger
    );
    const nms = await InferenceSession.create(arrBufNMS);

    // warmup main model
    setLoading({ text: "Warming up model...", progress: null });
    const tensor = new Tensor(
      "float32",
      new Float32Array(modelInputShape.reduce((a, b) => a * b)),
      modelInputShape
    );
    await yolov8.run({ images: tensor });

    setSession({ net: yolov8, nms: nms });
    setLoading(null);
  };

  // Function to handle webcam capture
  const captureWebcam = () => {
    if (webcamRef.current && webcamActive) {
      const webcamImage = webcamRef.current.getScreenshot();
      setImage(webcamImage);
    }
  };

  // Function to start automatic detection
  const startDetection = () => {
    setDetecting(true);
    // setWebcamActive(true);
    // setLastCapturedImage(undefined)
  };

  // Function to stop automatic detection
  const stopDetection = () => {
    setDetecting(false);
    setWebcamActive(false);
  };
  useEffect(() => {
    startDetection();
  });

  useEffect(() => {
    let detectionTimer = null;
    if (detecting) {
      detectionTimer = setInterval(() => {
        captureWebcam(); // Capture webcam image automatically
      }, detectionInterval);
    } else {
      clearInterval(detectionTimer);
    }

    return () => {
      clearInterval(detectionTimer);
    };
  }, [detecting]);

  const handleWebcamError = (error) => {
    console.error("Webcam error:", error);
    // Handle the error here (e.g., display an error message or redirect to a different page)
  };

  return (
    <div className="camera">
      {loading && (
        <Loader>
          {loading.progress
            ? `${loading.text} - ${loading.progress}%`
            : loading.text}
        </Loader>
      )}

      <div className="cameracontent">
        {lastCapturedImage ? (
          <div className="last-captured-image">
            <img
              src={lastCapturedImage}
              alt="Last Captured"
              style={{ maxWidth: "100%" }}
            />
          </div>
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "environment", // or "user" for front-facing camera
            }}
            onUserMediaError={handleWebcamError} // Handle webcam errors
            style={{
              display: "block",
              // transform: "rotate(90deg)",
              height: "100%",
              // objectFit: "cover",
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          />
        )}
        <canvas
          id="canvas"
          width={modelInputShape[2]}
          height={modelInputShape[3]}
          ref={canvasRef}
        />
      </div>
      {/* <Detectdata
        imageRef={imageRef.current}
        canvasRef={canvasRef.current}
        session={session}
        topk={topk}
        iouThreshold={iouThreshold}
        scoreThreshold={scoreThreshold}
        modelInputShape={modelInputShape}
      /> */}

      {image && (
        <img
          ref={imageRef}
          src={image}
          alt=""
          style={{
            display: "none",
            // transform: "rotate(90deg)",
            // height: "100%",
            // objectFit: "cover",
            // width: "100%",
            maxWidth: "800px",
            margin: "0 auto",
          }}
          onLoad={() => {
            detectImage(
              imageRef.current,
              canvasRef.current,
              session,
              topk,
              iouThreshold,
              scoreThreshold,
              modelInputShape
            )
              .then((boxes) => {
                if (!boxes) {
                  return;
                }
                // boxes 배열 내부의 데이터에 접근하여 활용
                const firstBox = boxes[0];
                const pro = firstBox.probability * 100; // 검출된 첫 번째 상자의 정보
                if (pro >= 50) {
                  console.log(123);
                  stopDetection();
                  setLastCapturedImage(image); // 마지막 캡처 이미지 저장
                }
                // 여기에 원하는 작업 추가
              })
              .catch((error) => {
                console.error("Error in detectImage:", error);
              });
          }}
        />
      )}
      {image ? (
        <div className="btn-container">
          <button
            className="camerabutton"
            onClick={() => {
              setImage(null);
            }}
          >
            Close image
          </button>
        </div>
      ) : (
        <div className="btn-container">
          {webcamActive ? (
            <button className="camerabutton" onClick={() => stopDetection()}>
              Stop Detection
            </button>
          ) : (
            <button
              className="camerabutton"
              onClick={() => startDetection() && setWebcamActive(true)}
            >
              Start Detection
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Camera;