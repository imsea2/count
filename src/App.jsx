import { useEffect, useState } from "react";
import "./App.css";
import bunnyImg from "./assets/rabbit.JPG";
import dogImg from "./assets/dog.JPG";
import hamsterImg from "./assets/hamster.jpg";
import catImg from "./assets/cat.jpg";


export default function App() {

    const PETS = [
        { key: "rabbit", label: "토끼", emoji: "🐰", img: bunnyImg, congrats: `축하합니다! 당신은 싸움짱 토끼 사진을 봤습니다. 
            당신은 토끼처럼 싸움짱이 됩니다..🐾` },
        { key: "dog", label: "강아지", emoji: "🐶", img: dogImg, congrats: `축하합니다! 당신은 이빨 강아지 사진을 봤습니다.
            당신은 슬퍼도 웃을 수 있는 힘을 가지게 됩니다..🥹` },
        { key: "hamster", label: "햄스터", emoji: "🐹", img: hamsterImg, congrats: `축하합니다! 당신은 싸움짱 햄스터 사진을 봤습니다.
            당신은 햄스터처럼 싸움짱이 됩니다..💪` },
        { key: "cat", label: "고양이", emoji: "🐱", img: catImg, congrats: `축하합니다! 당신은 네잎클로버 고양이 사진을 봤습니다.
            행운을 기다려 보세요! 🍀` },
    ];

    const [active, setActive] = useState("rabbit");

    const [counts, setCounts] = useState({
        rabbit: 0,
        dog: 0,
        hamster: 0,
        cat: 0,
    });

    const current = counts[active];

    // 기존: const fontSize = Math.min(300, 64 + current * 6);
    const MIN = 80;                  // 시작 크기(px) - 취향대로 조절
    const MAX = 420;                 // 끝 크기(px) - 컨테이너에 맞게 조절
    const level = Math.min(100, Math.max(0, current)); // 0~100으로 고정
    const fontSize = MIN + (MAX - MIN) * (level / 100); // 0~100을 선형으로 매핑

    const percent = Math.min(100, current);
    const stage =
        percent < 25 ? "콩알 🥚" :
            percent < 50 ? "아기 🐣" :
                percent < 75 ? "어린이 🐥" :
                    "어른 🐓";

    // ✅ 공통: n만큼 먹이 주기 (0~100 사이로 고정)
    const feedBy = (n) => {
        setCounts(prev => {
            const next = prev[active] + n;
            // 0보다 작아지지 않고, 100을 넘지 않게 클램프
            const clamped = Math.max(0, Math.min(100, next));
            return { ...prev, [active]: clamped };
        });
    };

    // 기존 +1 함수는 공통 함수 재사용
    const feed = () => feedBy(1);

    // (선택) -10도 만들고 싶으면 이런 식으로 쓸 수 있어요
    // const feedMinus10 = () => feedBy(-10);


    const onKey = (e) => {
        if (e.key === "Enter" || e.key === " ") feed();
    };

    const [isOpen, setIsOpen] = useState(false);      // 팝업 열림 여부
    const [winnerKey, setWinnerKey] = useState(null); // 팝업에 보여줄 펫 키

    // 펫별로 한 번만 축하 뜨게(RESET하면 다시 가능)
    const [celebrated, setCelebrated] = useState({
        rabbit: false, dog: false, hamster: false, cat: false
    });

    useEffect(() => {
        if (percent === 100 && !celebrated[active]) {
            setWinnerKey(active);                               // 어떤 펫이 달성했는지 저장
            setIsOpen(true);                                    // 모달 열기
            setCelebrated(prev => ({ ...prev, [active]: true })); // 중복 방지
        }
    }, [percent, active, celebrated]);

    useEffect(() => {
        if (!isOpen) return;
        const onEsc = (e) => e.key === "Escape" && setIsOpen(false);
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [isOpen]);

    const reset = () => {
        setCounts(prev => ({ ...prev, [active]: 0 }));
        setCelebrated(prev => ({ ...prev, [active]: false }));
    };



    return (
        // 화면 전체 컨테이너
        <div className="app">
            <div className="card">
                <h1 className="title">🐕 Tap to Grow PET 🐈</h1>
                <p className="desc">탭으로 펫을 고르고 먹이를 주면 펫이 자라요!
                    <br />
                    동물을 다 키우면 선물이 있을 수도..🎁
                </p>

                <div role="tablist" aria-label="펫 선택 탭" className="tabs">
                    {PETS.map((pet) => (
                        <button
                            key={pet.key}
                            role="tab"
                            aria-selected={active === pet.key}
                            onClick={() => setActive(pet.key)}
                            className={`tabBtn ${active === pet.key ? "active" : ""}`}
                            title={`${pet.label} 선택`}
                        >
                            <span className="tabEmoji">{pet.emoji}</span>
                            <span>{pet.label}</span>
                        </button>
                    ))}
                </div>

                <div
                    role="button"
                    tabIndex={0}
                    onClick={feed}
                    onKeyDown={onKey}
                    className="pet"
                    aria-label="펫에게 먹이주기"
                    title="클릭해서 먹이주기">
                    <span
                        className="pet-emoji"
                        style={{ fontSize }}>
                        {PETS.find(p => p.key === active)?.emoji}</span>
                </div>

                <div className="infoRow">
                    <strong>카운트 :</strong>
                    <span className="countNum">{current}</span>
                    <span className="stage">단계 :<strong>{stage}</strong></span>
                </div>

                <div className="barWrap" aria-label={`성장도 ${percent}%`}>
                    <div className="barFill" style={{ width: `${percent}%` }} />
                </div>

                <div className="row">
                    <button onClick={feed} className="btn btn--plus1">먹이주기 +1</button>
                    <button onClick={() => feedBy(10)} className="btn btn--plus10">먹이주기 +10</button>
                    <button onClick={reset} className="btn btn--reset">RESET</button>
                </div>


                <p className="tip">Tip: 탭을 바꿔도 각 펫 카운트는 따로 저장됩니다.</p>
            </div>

            {/* 100 달성 팝업 */}
            {isOpen && (() => {
                const pet = PETS.find(p => p.key === winnerKey);
                if (!pet) return null;
                return (
                    <div className="overlay" role="dialog" aria-modal="true" onClick={() => setIsOpen(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <img className="modal-img" src={pet.img} alt={`${pet.label} 축하 이미지`} />
                            <h2 className="modal-title">{pet.label} 100 달성! 🎉</h2>
                            <p className="modal-desc">{pet.congrats}</p>
                            <button className="btn" onClick={() => setIsOpen(false)}>닫기</button>
                        </div>
                    </div>
                );
            })()}

        </div>
    );


}