import MapModal from "./MapModal";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { mapModal_recoil, fishingInfo_recoil } from "../../utils/atoms";
import "./Map.css";
import axios from "../../api/SeaAPI";
import bada_axios from "../../api/BadanuriAPI";

// https://apis.map.kakao.com/web/guide/
// 잔상이 남는디..?

function Map() {
  const [data, setData] = useRecoilState(fishingInfo_recoil);
  const [modalOpen, setModalOpen] = useRecoilState(mapModal_recoil);
  const [mapInfomation, setMapInfomation] = useState({});

  useEffect(() => {
    const kakao = window["kakao"];
    kakao.maps.load(() => {
      const mapContainer = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스

      const options = {
        //지도를 생성할 때 필요한 기본 옵션

        // 로드될때 어디서 로드되는지를 보여줌 => 현재위치 받아서 박기
        center: new kakao.maps.LatLng(35.084833333, 129.033166667), //지도의 중심좌표.
        // center: new kakao.maps.LatLng(35.095651, 128.854831), //지도의 중심좌표.
        level: 3, //지도의 레벨(확대, 축소 정도)
      };
      const map = new kakao.maps.Map(mapContainer, options); //지도 생성 및 객체 리턴

      // 바다누리 api 마커 설정
      const badanuriPositions = [
        {
          title: "감천항",
          obsCode: "TW_0088",
          content: `<div id='title'>감천항</div>`,
          latlng: new kakao.maps.LatLng(35.052, 129.003),
        },
        {
          title: "경인항",
          obsCode: "TW_0077",
          content: `<div id='title'>경인항</div>`,
          latlng: new kakao.maps.LatLng(37.523, 126.592),
        },
        {
          title: "경포대해수욕장",
          obsCode: "TW_0089",
          content: `<div id='title'>경포대해수욕장</div>`,
          latlng: new kakao.maps.LatLng(37.808, 128.931),
        },
        {
          title: "고래불해수욕장",
          obsCode: "TW_0095",
          content: `<div id='title'>고래불해수욕장</div>`,
          latlng: new kakao.maps.LatLng(36.58, 129.454),
        },
        {
          title: "광양항",
          obsCode: "TW_0074",
          content: `<div id='title'>광양항</div>`,
          latlng: new kakao.maps.LatLng(34.859, 127.792),
        },
        {
          title: "군산항",
          obsCode: "TW_0072",
          content: `<div id='title'>군산항</div>`,
          latlng: new kakao.maps.LatLng(35.984, 126.508),
        },
        {
          title: "낙산해수욕장",
          obsCode: "TW_0091",
          content: `<div id='title'>낙산해수욕장</div>`,
          latlng: new kakao.maps.LatLng(38.122, 128.65),
        },
        {
          title: "남해동부",
          obsCode: "KG_0025",
          content: `<div id='title'>남해동부</div>`,
          latlng: new kakao.maps.LatLng(34.222, 128.419),
        },
        {
          title: "대천해수욕장",
          obsCode: "TW_0069",
          content: `<div id='title'>대천해수욕장</div>`,
          latlng: new kakao.maps.LatLng(36.274, 126.457),
        },
        {
          title: "대한해협",
          obsCode: "KG_0024",
          content: `<div id='title'>대한해협</div>`,
          latlng: new kakao.maps.LatLng(34.919, 129.121),
        },
        {
          title: "마산항",
          obsCode: "TW_0085",
          content: `<div id='title'>마산항</div>`,
          latlng: new kakao.maps.LatLng(35.103, 128.631),
        },
        {
          title: "망상해수욕장",
          obsCode: "TW_0094",
          content: `<div id='title'>망상해수욕장</div>`,
          latlng: new kakao.maps.LatLng(37.616, 129.103),
        },
        {
          title: "부산항",
          obsCode: "TW_0087",
          content: `<div id='title'>부산항</div>`,
          latlng: new kakao.maps.LatLng(35.091, 129.085),
        },
        {
          title: "부산항신항",
          obsCode: "TW_0086",
          content: `<div id='title'>부산항신항</div>`,
          latlng: new kakao.maps.LatLng(35.043, 128.761),
        },
        {
          title: "상왕등도",
          obsCode: "TW_0079",
          content: `<div id='title'>상왕등도</div>`,
          latlng: new kakao.maps.LatLng(35.652, 126.194),
        },
        {
          title: "생일도",
          obsCode: "TW_0081",
          content: `<div id='title'>생일도</div>`,
          latlng: new kakao.maps.LatLng(34.258, 126.96),
        },
        {
          title: "속초해수욕장",
          obsCode: "TW_0093",
          content: `<div id='title'>속초해수욕장</div>`,
          latlng: new kakao.maps.LatLng(38.198, 128.631),
        },
        {
          title: "송정해수욕장",
          obsCode: "TW_0090",
          content: `<div id='title'>송정해수욕장</div>`,
          latlng: new kakao.maps.LatLng(35.164, 129.219),
        },
        {
          title: "아산만",
          obsCode: "TW_0071",
          content: `<div id='title'>아산만</div>`,
          latlng: new kakao.maps.LatLng(36.997, 126.755),
        },
        {
          title: "여수항",
          obsCode: "TW_0083",
          content: `<div id='title'>여수항</div>`,
          latlng: new kakao.maps.LatLng(34.794, 127.808),
        },
        {
          title: "완도항",
          obsCode: "TW_0078",
          content: `<div id='title'>완도항</div>`,
          latlng: new kakao.maps.LatLng(34.325, 126.763),
        },
        {
          title: "우이도",
          obsCode: "TW_0080",
          content: `<div id='title'>우이도</div>`,
          latlng: new kakao.maps.LatLng(34.543, 125.802),
        },
        {
          title: "울릉도북동",
          obsCode: "KG_0101",
          content: `<div id='title'>울릉도북동</div>`,
          latlng: new kakao.maps.LatLng(38.007, 131.552),
        },
        {
          title: "울릉도북서",
          obsCode: "KG_0102",
          content: `<div id='title'>울릉도북서</div>`,
          latlng: new kakao.maps.LatLng(37.742, 130.601),
        },
        {
          title: "인천항",
          obsCode: "TW_0076",
          content: `<div id='title'>인천항</div>`,
          latlng: new kakao.maps.LatLng(37.389, 126.533),
        },
        {
          title: "임랑해수욕장",
          obsCode: "TW_0092",
          content: `<div id='title'>임랑해수욕장</div>`,
          latlng: new kakao.maps.LatLng(35.302, 129.292),
        },
        {
          title: "제주남부",
          obsCode: "KG_0021",
          content: `<div id='title'>제주남부</div>`,
          latlng: new kakao.maps.LatLng(32.09, 126.965),
        },
        {
          title: "제주해협",
          obsCode: "KG_0028",
          content: `<div id='title'>제주해협</div>`,
          latlng: new kakao.maps.LatLng(33.7, 126.59),
        },
        {
          title: "중문해수욕장",
          obsCode: "TW_0075",
          content: `<div id='title'>중문해수욕장</div>`,
          latlng: new kakao.maps.LatLng(33.234, 126.409),
        },
        {
          title: "태안항",
          obsCode: "TW_0082",
          content: `<div id='title'>태안항</div>`,
          latlng: new kakao.maps.LatLng(37.006, 126.27),
        },
        {
          title: "통영항",
          obsCode: "TW_0084",
          content: `<div id='title'>통영항</div>`,
          latlng: new kakao.maps.LatLng(34.773, 128.46),
        },
        {
          title: "한수원_고리",
          obsCode: "HB_0002",
          content: `<div id='title'>한수원_고리</div>`,
          latlng: new kakao.maps.LatLng(35.318, 129.314),
        },
        {
          title: "한수원_기장",
          obsCode: "HB_0001",
          content: `<div id='title'>한수원_기장</div>`,
          latlng: new kakao.maps.LatLng(35.182, 129.235),
        },
        {
          title: "한수원_나곡",
          obsCode: "HB_0009",
          content: `<div id='title'>한수원_나곡</div>`,
          latlng: new kakao.maps.LatLng(37.119, 129.395),
        },
        {
          title: "한수원_덕천",
          obsCode: "HB_0008",
          content: `<div id='title'>한수원_덕천</div>`,
          latlng: new kakao.maps.LatLng(37.1, 129.404),
        },
        {
          title: "한수원_온양",
          obsCode: "HB_0007",
          content: `<div id='title'>한수원_온양</div>`,
          latlng: new kakao.maps.LatLng(37.019, 129.425),
        },
        {
          title: "한수원_진하",
          obsCode: "HB_0003",
          content: `<div id='title'>한수원_진하</div>`,
          latlng: new kakao.maps.LatLng(35.384, 129.368),
        },
        {
          title: "해운대해수욕장",
          obsCode: "TW_0062	",
          content: `<div id='title'>해운대해수욕장</div>`,
          latlng: new kakao.maps.LatLng(35.148, 129.17),
        },
      ];

      // seaapi 마커 설정!!!
      const markerPositions = [
        {
          title: "남항동방파제등대",
          mmaf: "101",
          mmsi: "1019001",
          content: `<div id='title'>남항동방파제등대</div>`,
          latlng: new kakao.maps.LatLng(35.084833333, 129.033166667),
        },
        {
          title: "송정리등표",
          mmaf: "101",
          mmsi: "1019003",
          content: `<div id='title'>송정리등표</div>`,
          latlng: new kakao.maps.LatLng(35.169166667, 129.2175),
        },
        {
          title: "부산항유도등부표(랜비)",
          mmaf: "101",
          mmsi: "994401597",
          content: `<div id='title'>부산항유도등부표(랜비)</div>`,
          latlng: new kakao.maps.LatLng(35.0665, 129.131),
        },
        {
          title: "남형제도등표",
          mmaf: "101",
          mmsi: "994401594",
          content: `<div id='title'>남형제도등표</div>`,
          latlng: new kakao.maps.LatLng(34.885166667, 128.95),
        },
        {
          title: "가덕도등대",
          mmaf: "101",
          mmsi: "994401588",
          content: `<div id='title'>가덕도등대</div>`,
          latlng: new kakao.maps.LatLng(34.9895, 128.829166667),
        },
        {
          title: "나무섬등대",
          mmaf: "101",
          mmsi: "994401587",
          content: `<div id='title'>나무섬등대</div>`,
          latlng: new kakao.maps.LatLng(34.979666667, 128.9895),
        },
        {
          title: "부산항신항중앙C호등부표",
          mmaf: "101",
          mmsi: "994401584",
          content: `<div id='title'>부산항신항중앙C호등부표</div>`,
          latlng: new kakao.maps.LatLng(35.024, 128.7885),
        },
        {
          title: "신항유도등부표(랜비)",
          mmaf: "101",
          mmsi: "994401583",
          content: `<div id='title'>신항유도등부표(랜비)</div>`,
          latlng: new kakao.maps.LatLng(34.966666667, 128.813),
        },
        {
          title: "감천항유도등부표(랜비)",
          mmaf: "101",
          mmsi: "994401579",
          content: `<div id='title'>감천항유도등부표(랜비)</div>`,
          latlng: new kakao.maps.LatLng(35.032, 129.022166667),
        },
        {
          title: "오륙도등대",
          mmaf: "101",
          mmsi: "994401578",
          content: `<div id='title'>오륙도등대</div>`,
          latlng: new kakao.maps.LatLng(35.091333333, 129.127),
        },
        {
          title: "백령도 용기포항여객터미널",
          mmaf: "102",
          mmsi: "1029001",
          content: `<div id='title'>백령도 용기포항여객터미널</div>`,
          latlng: new kakao.maps.LatLng(37.95575, 124.7351),
        },
        {
          title: "인천항동수도12호등부표",
          mmaf: "102",
          mmsi: "994401000",
          content: `<div id='title'>인천항동수도12호등부표</div>`,
          latlng: new kakao.maps.LatLng(37.21833333, 126.4197219444),
        },
        {
          title: "인천항서수도5호등부표",
          mmaf: "102",
          mmsi: "994401001",
          content: `<div id='title'>인천항서수도5호등부표</div>`,
          latlng: new kakao.maps.LatLng(37.2780555, 126.2372222),
        },
        {
          title: "팔미도등대",
          mmaf: "102",
          mmsi: "994401013",
          content: `<div id='title'>팔미도등대</div>`,
          latlng: new kakao.maps.LatLng(37.3583333333, 126.5108333333),
        },
        {
          title: "부도등대",
          mmaf: "102",
          mmsi: "994401014",
          content: `<div id='title'>부도등대</div>`,
          latlng: new kakao.maps.LatLng(37.14955, 126.3480833333),
        },
        {
          title: "선미도등대",
          mmaf: "102",
          mmsi: "994401015",
          content: `<div id='title'>선미도등대</div>`,
          latlng: new kakao.maps.LatLng(37.28738889, 126.0774444),
        },
        {
          title: "소청도등대",
          mmaf: "102",
          mmsi: "994401016",
          content: `<div id='title'>소청도등대</div>`,
          latlng: new kakao.maps.LatLng(37.7608333333, 124.7286111111),
        },
        {
          title: "목덕도등대",
          mmaf: "102",
          mmsi: "994401017",
          content: `<div id='title'>목덕도등대</div>`,
          latlng: new kakao.maps.LatLng(36.9286111111, 125.7869444444),
        },
        {
          title: "인천항석탄부두A호등대",
          mmaf: "102",
          mmsi: "994401018",
          content: `<div id='title'>인천항석탄부두A호등대</div>`,
          latlng: new kakao.maps.LatLng(37.4383333333, 126.5869444444),
        },
        {
          title: "소야도등대",
          mmaf: "102",
          mmsi: "994401019",
          content: `<div id='title'>소야도등대</div>`,
          latlng: new kakao.maps.LatLng(37.2083333333, 126.1938888889),
        },
        {
          title: "소연평도등대",
          mmaf: "102",
          mmsi: "994401020",
          content: `<div id='title'>소연평도등대</div>`,
          latlng: new kakao.maps.LatLng(37.6044444444, 125.7177777778),
        },
        {
          title: "서포리남방등표",
          mmaf: "102",
          mmsi: "994401021",
          content: `<div id='title'>서포리남방등표</div>`,
          latlng: new kakao.maps.LatLng(37.2136111111, 126.0916666667),
        },
        {
          title: "북장자서등표",
          mmaf: "102",
          mmsi: "994401022",
          content: `<div id='title'>북장자서등표</div>`,
          latlng: new kakao.maps.LatLng(37.3294444444, 126.4777777778),
        },
        {
          title: "초치암등표",
          mmaf: "102",
          mmsi: "994401023",
          content: `<div id='title'>초치암등표</div>`,
          latlng: new kakao.maps.LatLng(37.3280555556, 126.2227777778),
        },
        {
          title: "민어여등표",
          mmaf: "102",
          mmsi: "994401024",
          content: `<div id='title'>민어여등표</div>`,
          latlng: new kakao.maps.LatLng(37.125, 125.9252777778),
        },
        {
          title: "고식이등표",
          mmaf: "102",
          mmsi: "994401039",
          content: `<div id='title'>고식이등표</div>`,
          latlng: new kakao.maps.LatLng(37.485, 126.3030556),
        },
        {
          title: "인천항항로분기등부표",
          mmaf: "102",
          mmsi: "994401040",
          content: `<div id='title'>인천항항로분기등부표</div>`,
          latlng: new kakao.maps.LatLng(37.33944444, 126.45861111),
        },
        {
          title: "광양항등표",
          mmaf: "103",
          mmsi: "994402917",
          content: `<div id='title'>광양항등표</div>`,
          latlng: new kakao.maps.LatLng(34.8819444444, 127.7597222222),
        },
        {
          title: "중결도등대",
          mmaf: "103",
          mmsi: "994402925",
          content: `<div id='title'>중결도등대</div>`,
          latlng: new kakao.maps.LatLng(34.31375, 127.2403055556),
        },
        {
          title: "여초등표",
          mmaf: "103",
          mmsi: "994402955",
          content: `<div id='title'>여초등표</div>`,
          latlng: new kakao.maps.LatLng(34.688, 127.6990555556),
        },
        {
          title: "여수해만중앙A호유도등부표",
          mmaf: "103",
          mmsi: "994403110",
          content: `<div id='title'>여수해만중앙A호유도등부표</div>`,
          latlng: new kakao.maps.LatLng(34.5947222222, 127.9452777778),
        },
        {
          title: "울산항근치암남서방등부표",
          mmaf: "104",
          mmsi: "1000507",
          content: `<div id='title'>울산항근치암남서방등부표</div>`,
          latlng: new kakao.maps.LatLng(35.466777778, 129.409638889),
        },
        {
          title: "울산항동방파제서단등대",
          mmaf: "104",
          mmsi: "1000519",
          content: `<div id='title'>울산항동방파제서단등대</div>`,
          latlng: new kakao.maps.LatLng(35.4665, 129.399888889),
        },
        {
          title: "울산항등부표",
          mmaf: "104",
          mmsi: "1000520",
          content: `<div id='title'>울산항등부표</div>`,
          latlng: new kakao.maps.LatLng(35.363666667, 129.436472222),
        },
        {
          title: "울산항동방파제파고부표",
          mmaf: "104",
          mmsi: "3000001",
          content: `<div id='title'>울산항동방파제파고부표</div>`,
          latlng: new kakao.maps.LatLng(35.452033, 129.403611111),
        },
        {
          title: "신도타서등표",
          mmaf: "105",
          mmsi: "4402692",
          content: `<div id='title'>신도타서등표</div>`,
          latlng: new kakao.maps.LatLng(36.895, 126.15),
        },
        {
          title: "대산항제2항로제3호등부표",
          mmaf: "105",
          mmsi: "4422880",
          content: `<div id='title'>대산항제2항로제3호등부표</div>`,
          latlng: new kakao.maps.LatLng(37.0416388888, 126.3423888888),
        },
        {
          title: "옹도등대",
          mmaf: "105",
          mmsi: "994402651",
          content: `<div id='title'>옹도등대</div>`,
          latlng: new kakao.maps.LatLng(36.6466666667, 126.0083333333),
        },
        {
          title: "소녀암등표",
          mmaf: "105",
          mmsi: "994402675",
          content: `<div id='title'>소녀암등표</div>`,
          latlng: new kakao.maps.LatLng(36.32, 126.4733333333),
        },
        {
          title: "무당서등표",
          mmaf: "106",
          mmsi: "994401037",
          content: `<div id='title'>무당서등표</div>`,
          latlng: new kakao.maps.LatLng(37.1561722222, 126.4162888889),
        },
        {
          title: "입파도등대",
          mmaf: "106",
          mmsi: "994401042",
          content: `<div id='title'>입파도등대</div>`,
          latlng: new kakao.maps.LatLng(37.1085611111, 126.539675),
        },
        {
          title: "(기상)안좌여객선터미널",
          mmaf: "107",
          mmsi: "1079001",
          content: `<div id='title'>(기상)안좌여객선터미널</div>`,
          latlng: new kakao.maps.LatLng(34.759661, 126.133262),
        },
        {
          title: "(기상)홍도등대",
          mmaf: "107",
          mmsi: "1079002",
          content: `<div id='title'>(기상)홍도등대</div>`,
          latlng: new kakao.maps.LatLng(34.714297, 125.201797),
        },
        {
          title: "(기상)가거도등대",
          mmaf: "107",
          mmsi: "1079003",
          content: `<div id='title'>(기상)가거도등대</div>`,
          latlng: new kakao.maps.LatLng(34.095377, 125.09857),
        },
        {
          title: "(기상)계마항방파제등대",
          mmaf: "107",
          mmsi: "1079004",
          content: `<div id='title'>(기상)계마항방파제등대</div>`,
          latlng: new kakao.maps.LatLng(35.39025, 126.403055556),
        },
        {
          title: "(기상)매물도등대",
          mmaf: "107",
          mmsi: "1079005",
          content: `<div id='title'>(기상)매물도등대</div>`,
          latlng: new kakao.maps.LatLng(34.522435, 125.685892),
        },
        {
          title: "(기상)우세도등대",
          mmaf: "107",
          mmsi: "1079006",
          content: `<div id='title'>(기상)우세도등대</div>`,
          latlng: new kakao.maps.LatLng(34.791416667, 125.908),
        },
        {
          title: "(기상)대노록도등대",
          mmaf: "107",
          mmsi: "1079007",
          content: `<div id='title'>(기상)대노록도등대</div>`,
          latlng: new kakao.maps.LatLng(35.103018, 125.987915),
        },
        {
          title: "(기상)외달도등표",
          mmaf: "107",
          mmsi: "1079008",
          content: `<div id='title'>(기상)외달도등표</div>`,
          latlng: new kakao.maps.LatLng(34.777861111, 126.288611111),
        },
        {
          title: "비응항서방파제남단등대",
          mmaf: "108",
          mmsi: "4406120",
          content: `<div id='title'>비응항서방파제남단등대</div>`,
          latlng: new kakao.maps.LatLng(35.9335269444, 126.52747),
        },
        {
          title: "군산연도등대",
          mmaf: "108",
          mmsi: "994403652",
          content: `<div id='title'>군산연도등대</div>`,
          latlng: new kakao.maps.LatLng(36.08113, 126.43597),
        },
        {
          title: "상왕등도등대",
          mmaf: "108",
          mmsi: "994403654",
          content: `<div id='title'>상왕등도등대</div>`,
          latlng: new kakao.maps.LatLng(35.6621111111, 126.10705),
        },
        {
          title: "흑서등표",
          mmaf: "108",
          mmsi: "994403658",
          content: `<div id='title'>흑서등표</div>`,
          latlng: new kakao.maps.LatLng(35.61905556, 126.3632778),
        },
        {
          title: "군산흑도등표",
          mmaf: "108",
          mmsi: "994403661",
          content: `<div id='title'>군산흑도등표</div>`,
          latlng: new kakao.maps.LatLng(35.82619, 126.37216),
        },
        {
          title: "견내량등표",
          mmaf: "109",
          mmsi: "2091003",
          content: `<div id='title'>견내량등표</div>`,
          latlng: new kakao.maps.LatLng(34.885, 128.4736666667),
        },
        {
          title: "흑암등표",
          mmaf: "109",
          mmsi: "2095081",
          content: `<div id='title'>흑암등표</div>`,
          latlng: new kakao.maps.LatLng(35.0402222222, 128.6101944444),
        },
        {
          title: "고암등대",
          mmaf: "109",
          mmsi: "994401606",
          content: `<div id='title'>고암등대</div>`,
          latlng: new kakao.maps.LatLng(34.498, 128.4763333333),
        },
        {
          title: "고도등표",
          mmaf: "109",
          mmsi: "994401623",
          content: `<div id='title'>고도등표</div>`,
          latlng: new kakao.maps.LatLng(34.68, 128.0633333333),
        },
        {
          title: "영일만항분리항로등부표(랜비)",
          mmaf: "110",
          mmsi: "994403579",
          content: `<div id='title'>영일만항분리항로등부표(랜비)</div>`,
          latlng: new kakao.maps.LatLng(36.0782777778, 129.4766666667),
        },
        {
          title: "도동등대",
          mmaf: "110",
          mmsi: "994403582",
          content: `<div id='title'>도동등대</div>`,
          latlng: new kakao.maps.LatLng(37.487, 130.9194166667),
        },
        {
          title: "임원항방파제등대",
          mmaf: "111",
          mmsi: "994403807",
          content: `<div id='title'>임원항방파제등대</div>`,
          latlng: new kakao.maps.LatLng(37.224858, 129.345192),
        },
        {
          title: "동해항남방파제등대",
          mmaf: "111",
          mmsi: "994403808",
          content: `<div id='title'>동해항남방파제등대</div>`,
          latlng: new kakao.maps.LatLng(37.49665, 129.144667),
        },
        {
          title: "주문진항동방파제등대",
          mmaf: "111",
          mmsi: "994403810",
          content: `<div id='title'>주문진항동방파제등대</div>`,
          latlng: new kakao.maps.LatLng(37.885889, 128.834711),
        },
        {
          title: "김녕항서방파제등대",
          mmaf: "112",
          mmsi: "994403894",
          content: `<div id='title'>김녕항서방파제등대</div>`,
          latlng: new kakao.maps.LatLng(33.5683288574, 126.7457962036),
        },
        {
          title: "방서등대",
          mmaf: "112",
          mmsi: "994403895",
          content: `<div id='title'>방서등대</div>`,
          latlng: new kakao.maps.LatLng(33.9215316772, 126.399597168),
        },
        {
          title: "개민포등대",
          mmaf: "112",
          mmsi: "994403896",
          content: `<div id='title'>개민포등대</div>`,
          latlng: new kakao.maps.LatLng(33.3199501038, 126.8479003906),
        },
        {
          title: "우도등표",
          mmaf: "112",
          mmsi: "994403897",
          content: `<div id='title'>우도등표</div>`,
          latlng: new kakao.maps.LatLng(33.5144500732, 126.9721984863),
        },
        {
          title: "중뢰등표",
          mmaf: "112",
          mmsi: "994403901",
          content: `<div id='title'>중뢰등표</div>`,
          latlng: new kakao.maps.LatLng(33.797668457, 126.3225021362),
        },
        {
          title: "하조도등대(기)",
          mmaf: "113",
          mmsi: "1139001",
          content: `<div id='title'>하조도등대(기)</div>`,
          latlng: new kakao.maps.LatLng(34.3111, 126.087797),
        },
        {
          title: "어룡도등대(기)",
          mmaf: "113",
          mmsi: "1139002",
          content: `<div id='title'>어룡도등대(기)</div>`,
          latlng: new kakao.maps.LatLng(34.2868, 126.473197),
        },
        {
          title: "여서도등대(기)",
          mmaf: "113",
          mmsi: "1139003",
          content: `<div id='title'>여서도등대(기)</div>`,
          latlng: new kakao.maps.LatLng(33.9877, 126.918294),
        },
        {
          title: "황제도등대(기)",
          mmaf: "113",
          mmsi: "1139004",
          content: `<div id='title'>황제도등대(기)</div>`,
          latlng: new kakao.maps.LatLng(34.1933, 127.08),
        },
        {
          title: "녹도등대(기)",
          mmaf: "113",
          mmsi: "1139005",
          content: `<div id='title'>녹도등대(기)</div>`,
          latlng: new kakao.maps.LatLng(34.5593969444, 126.3205030556),
        },
        {
          title: "횡간도등대(기)",
          mmaf: "113",
          mmsi: "1139006",
          content: `<div id='title'>횡간도등대(기)</div>`,
          latlng: new kakao.maps.LatLng(34.250497, 126.6128),
        },
        {
          title: "완도항 유도등부표(기)",
          mmaf: "113",
          mmsi: "1139007",
          content: `<div id='title'>완도항 유도등부표(기)</div>`,
          latlng: new kakao.maps.LatLng(34.2535, 126.808294),
        },
      ];

      // 바다 누리 마커 생성
      for (let i = 0; i < badanuriPositions.length; i++) {
        // 마커 생성
        const marker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: badanuriPositions[i].latlng, // 마커를 표시할 위치
          title: badanuriPositions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          obsCode: badanuriPositions[i].obsCode,
        });

        const overlay = new kakao.maps.CustomOverlay({
          content: badanuriPositions[i].content,
          map: map,
          position: marker.getPosition(),
        });
        kakao.maps.event.addListener(
          marker,
          "click",
          makeOverListener("badanuri", badanuriPositions[i])
        );
      }

      // seaAPI 마커 생성
      for (let i = 0; i < markerPositions.length; i++) {
        // 마커 생성
        const marker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: markerPositions[i].latlng, // 마커를 표시할 위치
          title: markerPositions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          mmaf: markerPositions[i].mmaf,
          mmsi: markerPositions[i].mmsi,
        });

        const overlay = new kakao.maps.CustomOverlay({
          content: markerPositions[i].content,
          map: map,
          position: marker.getPosition(),
        });

        // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
        // 이벤트 리스너로는 클로저를 만들어 등록합니다
        // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
        kakao.maps.event.addListener(
          marker,
          "click",
          makeOverListener("sea", markerPositions[i])
        );
      }

      function makeOverListener(api, markerPosition) {
        return function () {
          // infowindow.open(map, marker);

          // 해양정보 불러오기 (seaAPI)
          if (api === "sea") {
            fetchData({
              api: api,
              mmaf: markerPosition.mmaf,
              mmsi: markerPosition.mmsi,
            });
          } else if (api === "badanuri") {
            // console.log(markerPosition);
            fetchData({ api: api, ObsCode: markerPosition.obsCode });
          }
          // 모달을 만들어보자
          // setModalOpen(true);
          // console.log(markerPosition);
          setMapInfomation(markerPosition);
        };
      }
      // 해양 정보 받아오는 api
      const fetchData = async (props) => {
        try {
          if (props.api === "sea") {
            const response = await axios.get(
              `openWeatherNow.do?mmaf=${props.mmaf}&mmsi=${props.mmsi}`
            );
            setData(response.data.result.recordset);
          } else if (props.api === "badanuri") {
            const response = await bada_axios.get(
              `buObsRecent/search.do?ObsCode=${props.ObsCode}`
            );
            const new_data = [
              {
                MMSI_NM: response.data.result.meta.obs_post_name,
                AIR_TEMPERATURE: response.data.result.data.air_temp,
                LATITUDE: response.data.result.meta.obs_lat,
                LONGITUDE: response.data.result.meta.obs_lon,
                WIND_DIRECT: response.data.result.data.wind_dir,
                AIR_PRESSURE: response.data.result.data.air_pres,
                WIND_SPEED: response.data.result.data.wind_speed,
                WAVE_HEIGHT: response.data.result.data.wave_height,
                SALINITY: response.data.result.data.Salinity,
                WATER_TEMPER: response.data.result.data.water_temp,
              },
            ];
            setData(new_data);
            // console.log(response.data.result.data);
          }
          // 모달열기
          setModalOpen(true);
        } catch (e) {
          console.log(e);
        }
      };
    });
  }, []);

  return (
    <div>
      {modalOpen && <MapModal setModalOpen={setModalOpen} />}
      <div id="map" className="map"></div>
    </div>
  );
}

export default Map;