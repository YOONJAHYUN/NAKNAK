import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import cv from "@techstark/opencv-js";
import { Tensor, InferenceSession } from "onnxruntime-web";
import Loader from "./components/loader";
import { detectImage } from "./utils/detect";
import { download } from "./utils/download";
import "./style/App.css";
// import { initializeCV } from "./utils/initializeCV";
import { useRecoilState } from "recoil";
import {
  yolo_recoil,
  newbie_recoil,
  tts_recoil,
  location_recoil,
} from "../../utils/atoms";
import upgradeProgress from "../freshman/upgradeProgress";
import { useNavigate } from "react-router-dom";
import Talk2 from "../freshman/Talk2";
import "./Camera.css";
import { authorizedRequest } from "../account/AxiosInterceptor";
import TTS from "../freshman/TTS";
import { GetLocation, callFlutter } from "../../utils/location";

const Camera = () => {
  // useEffect(() => {
  //   if (!sessionStorage.getItem("pageLoaded")) {
  //     sessionStorage.setItem("pageLoaded", "true");
  //     window.location.reload();
  //   }
  //   return () => {
  //     sessionStorage.removeItem("pageLoaded");
  //   };
  // }, []);
  // // 페이지에 처음 접근할 때
  // if (!sessionStorage.getItem("pageLoaded")) {
  //   sessionStorage.setItem("pageLoaded", "true");
  //   window.location.reload();
  // } else {
  //   window.onbeforeunload = () => {
  //     sessionStorage.removeItem("pageLoaded");
  //   };
  // }

  // window.location.replace("/Camera");
  // 뉴비모드
  const [newbie, setNewbie] = useRecoilState(newbie_recoil);
  const [step, setStep] = useState(6);
  const navigate = useNavigate();
  const [tts, setTts] = useRecoilState(tts_recoil);
  const [show, setShow] = useState(false);
  const [firstbox, setfirstbox] = useState([]);

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState({
    text: "Loading OpenCV.js",
    progress: null,
    isStuck: false, // 새로고침 유도 상태 변수
  });
  const [image, setImage] = useState(null);
  const inputImage = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const webcamRef = useRef(null); // Reference to the webcam component
  const [detecting, setDetecting] = useState(false); // State to control automatic detection
  const [lastCapturedImage, setLastCapturedImage] = useState(null);
  const [webcamActive, setWebcamActive] = useState(true);
  const [errData, setErrData] = useState(false);
  const [yoloRecoil, setyoloRecoil] = useRecoilState(yolo_recoil);
  const [location, setLocation] = useRecoilState(location_recoil);
  // Configs
  const modelName = "best.onnx";
  const modelInputShape = [1, 3, 640, 640];
  const topk = 100;
  const iouThreshold = 0.45;
  const scoreThreshold = 0.25;

  // 뉴비 모드일때 시간 길게 수정하기
  const detectionInterval = 1000;

  useEffect(() => {
    setTimeout(() => setShow(true), tts);
  }, [tts]);

  useEffect(() => {
    handlebutton();
  }, []);

  const handlebutton = () => {
    if (window.flutter_inappwebview) {
      handleButtonClick();
    } else {
      handleClick();
    }
  };

  async function handleButtonClick() {
    const data = await callFlutter();
    setLocation(data);
    // {latitude: 35.1029935, longitude: 128.8519049}
  }

  // 버튼을 누를 때 호출되는 함수
  function handleClick() {
    (async () => {
      try {
        const locationData = await GetLocation();
        // 위치 데이터를 이용한 추가 작업
        console.log(locationData);
        setLocation(locationData);
        // {latitude: 35.1029935, longitude: 128.8519049}
      } catch (error) {
        // 오류 처리
      }
    })();
  }
  const dataUpload = async () => {
    const data = {
      label: firstbox.label,
      bounding: firstbox.bounding,
      probability: firstbox.probability,
      location: location,
    };
    console.log(data);

    try {
      const response = await authorizedRequest({
        method: "post",
        url: "/api1/api/fishes/catch",
        data: {
          label: firstbox.label,
          bounding: firstbox.bounding,
          probability: firstbox.probability,
          location: location,
        },
      });
      console.log(response);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  // 뉴비 튜토리얼 업그레이드
  const handleUpgradeProgress = async (status) => {
    try {
      const response = await upgradeProgress(status);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };
  // 뉴비버젼
  const next = () => {
    setShow(false);
    if (step < 8) {
      setStep(step + 1);
    } else {
      handleUpgradeProgress(80);
      navigate("/Checkbox");
    }
  };

  // console.log(cv, 12345);
  useEffect(() => {
    // setSession({ net: yoloRecoil.net, nms: yoloRecoil.nms });
    setLoading(null);
  }, []);
  const handleBeforeUnload = (e) => {
    e.preventDefault();
    e.returnValue = ""; // 빈 문자열로 설정하여 브라우저가 경고 메시지를 표시하지 않도록 합니다.
  };
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  // cv["onRuntimeInitialized"] = async () => {
  //   console.log(errData, 111);
  //   try {
  //     console.log(123);
  //     const baseModelURL = `${process.env.PUBLIC_URL}/model`;
  //     const modelInputShape = [1, 3, 320, 320];
  //     console.log(baseModelURL);

  //     // create session
  //     const arrBufNet = await download(
  //       `${baseModelURL}/${modelName}`, // url
  //       ["Loading YOLOv8 Segmentation model", setLoading] // logger
  //     );
  //     const yolov8 = await InferenceSession.create(arrBufNet);

  //     const arrBufNMS = await download(
  //       `${baseModelURL}/nms-yolov8.onnx`, // url
  //       ["Loading NMS model", setLoading] // logger
  //     );
  //     const nms = await InferenceSession.create(arrBufNMS);

  //     console.log(arrBufNet, yolov8, arrBufNMS, nms);

  //     // warmup main model
  //     setLoading({ text: "Warming up model...", progress: null });
  //     const tensor = new Tensor(
  //       "float32",
  //       new Float32Array(modelInputShape.reduce((a, b) => a * b)),
  //       modelInputShape
  //     );
  //     await yolov8.run({ images: tensor });

  //     if (yolov8 && nms) {
  //       setLoading(null);
  //       setSession({ net: yolov8, nms: nms });
  //     } else {
  //       console.error("'yolov8' or 'nms' is null.");
  //     }
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //     // Handle the error as needed, e.g., show an error message to the user.
  //   }
  // };
  // console.log(errData, 222);
  // setTimeout(() => {
  //   rere();
  // }, 5000);

  // const rere = () => {
  //   if (!errData) {
  //     window.location.reload();
  //   }
  // };

  // console.log(cv);
  // Function to handle webcam capture
  const captureWebcam = () => {
    if (webcamRef.current && webcamActive) {
      const webcamImage = webcamRef.current.getScreenshot();
      setImage(webcamImage);
      console.log(image);
    }
  };

  // Function to start automatic detection
  const startDetection = () => {
    setDetecting(true);
    setWebcamActive(true);
    // setLastCapturedImage(undefined)
  };

  // Function to stop automatic detection
  const stopDetection = () => {
    setDetecting(false);
    setWebcamActive(false);
  };
  useEffect(() => {
    startDetection(); // 페이지에 처음 접근할 때 감지 시작
    return () => {
      stopDetection(); // 페이지를 떠날 때 감지 중지
    };
  }, []);

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
  // console.log(session);

  return (
    <div className="camera">
      {/* 뉴비모드 시작 */}
      {newbie && (
        <div className="pic-newbie-talk-box">
          {Talk2[step].content}
          {Talk2[step].content && <TTS message={Talk2[step].content} />}
          <div
            className="next"
            onClick={() => {
              next();
            }}
          >
            다음 &gt;
          </div>
        </div>
      )}
      {/* 뉴비모드 끝 */}
      {loading && (
        <Loader>
          {loading.progress
            ? `${loading.text} - ${loading.progress}%`
            : loading.text}
        </Loader>
      )}

      <div className="cameracontent">
        {lastCapturedImage ? (
          <div
            className="last-captured-image"
            style={{ height: "100%", width: "100%", maxWidth: "800px" }}
          >
            <img
              src={lastCapturedImage}
              alt="Last Captured"
              style={{
                display: "block",
                // transform: "rotate(90deg)",
                height: "100%",
                objectFit: "fill",
                width: "100%",
                maxWidth: "800px",
                margin: "0 auto",
              }}
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
              objectFit: "fill",
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
            if ({ net: yoloRecoil.net, nms: yoloRecoil.nms }) {
              // console.log(session);
              detectImage(
                imageRef.current,
                canvasRef.current,
                { net: yoloRecoil.net, nms: yoloRecoil.nms },
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
                  setfirstbox(boxes[0]);
                  console.log(firstbox);
                  const pro = firstbox.probability * 100; // 검출된 첫 번째 상자의 정보
                  if (pro >= 60) {
                    console.log(123);
                    stopDetection();
                    setLastCapturedImage(image); // 마지막 캡처 이미지 저장
                    // console.log(lastCapturedImage);
                  }
                  // 여기에 원하는 작업 추가
                })
                .catch((error) => {
                  console.error("Error in detectImage:", error);
                });
            }
          }}
        />
      )}
      {/* {lastCapturedImage ? (
        <div className="btn-container">
          <button
            className="camerabutton"
            onClick={() => {
              setLastCapturedImage(null) &&
                detectImage(
                  imageRef.current,
                  canvasRef.current,
                  { net: yoloRecoil.net, nms: yoloRecoil.nms },
                  topk,
                  iouThreshold,
                  scoreThreshold,
                  modelInputShape
                );
            }}
          >
            Close image
          </button>
        </div>
      ) : ( */}
      <div className="btn-container">
        {webcamActive ? (
          <button className="camerabutton" onClick={() => stopDetection()}>
            Stop Detection
          </button>
        ) : (
          <button
            className="camerabutton"
            onClick={() =>
              startDetection() &
              setWebcamActive(true) &
              setLastCapturedImage(null)
            }
          >
            Start Detection
          </button>
        )}
      </div>
      {/* )} */}
      <button onClick={() => dataUpload()}>등록</button>
    </div>
  );
};

export default Camera;
