import { useState } from "react";
import "./App.css";
export default function App() {

    const PETS = [
        { key: "rabbit", label: "토끼", emoji: "🐰" },
        { key: "dog", label: "강아지", emoji: "🐶" },
        { key: "hamster", label: "햄스터", emoji: "🐹" },
        { key: "cat", label: "고양이", emoji: "🐱" },
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
        percent < 25 ? "🥚 콩알" :
            percent < 50 ? "🐣 아기" :
                percent < 75 ? "🐥 어린이" :
                    "🐓 어른";

    const feed = () => {
        setCounts(prev => ({
            ...prev,
            [active]: prev[active] + 1,
        }));
    };

    const reset = () => {
        setCounts(prev => ({
            ...prev,
            [active]: 0,
        }));
    };

    const onKey = (e) => {
        if (e.key === "Enter" || e.key === " ") feed();
    };

    return (
        // 화면 전체 컨테이너
        <div className="app">
            <div className="card">
                <h1 className="title">Tap to Grow PET</h1>
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
                    <strong>카운트:</strong>
                    <span className="countNum">{current}</span>
                    <span className="stage">단계:<strong>{stage}</strong></span>
                </div>

                <div className="barWrap" aria-label={`성장도 ${percent}%`}>
                    <div className="barFill" style={{ width: `${percent}%` }} />
                </div>

                <div className="row">
                    <button onClick={feed} className="btn">먹이주기 +1</button>
                    <button onClick={reset} className="btn">RESET</button>
                </div>

                <p className="tip">Tip: 탭을 바꿔도 각 펫 카운트는 따로 저장돼요!</p>
            </div>
        </div>
    );


}