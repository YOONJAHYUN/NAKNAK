import React, { useEffect } from "react";
import "./SlideInnerMenu.css";
import { authorizedRequest } from "../account/AxiosInterceptor";

const SlideInnerMenu = ({
  onClose,
  menuPosition,
  onDeleteSlide,
  fishInfo,
  isFishBowl,
  itemchange,
}) => {
  console.log(fishInfo);
  const handleMenuClose = (e) => {
    e.stopPropagation();
    onClose(); // 부모 컴포넌트로부터 받은 onClose 함수 호출
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDeleteSlide();
    // onClose();
  };

  const handleChange = async (id) => {
    if (isFishBowl === "true") {
      try {
        const response = await authorizedRequest({
          method: "post",
          url: "/api1/api/fishes/intoinven",
          data: { targetId: id },
        });
        console.log(response);
        itemchange();
      } catch (error) {
        console.error("Error posting data:", error);
      }
    } else {
      try {
        const response = await authorizedRequest({
          method: "post",
          url: "/api1/api/fishes/intobowl",
          data: { targetId: id },
        });
        console.log(response);
        itemchange();
      } catch (error) {
        console.error("Error posting data:", error);
      }
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const menuElement = document.querySelector(".slide-inner-menu");
      if (menuElement && !menuElement.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div
      className={
        isFishBowl === "false"
          ? "slide-inner-menu-inven"
          : "slide-inner-menu-fishbowl"
      }
    >
      {isFishBowl === "false" && (
        <button onClick={handleDelete} className="invenbtn-del">
          자연으로
        </button>
      )}
      {/* <button onClick={handleMenuClose}>Close</button> */}
      <button
        className="invenbtn"
        onClick={() => {
          isFishBowl === "false"
            ? handleChange(fishInfo.inventoryId)
            : handleChange(fishInfo.fishBowlId);
        }}
      >
        {isFishBowl === "false" ? <span>어항으로</span> : <span>인벤으로</span>}
      </button>
    </div>
  );
};

export default SlideInnerMenu;