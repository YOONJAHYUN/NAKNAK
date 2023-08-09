import React from "react";

function Checklist({ text, completed, onToggle, onRemove }) {
  return (
    <div className={`checklist-item ${completed ? "completed" : ""}`}>
      <div className="checklist-text" onClick={onToggle}>
        {text}{" "}
        <span>
          <button className="checklist-remove" onClick={onRemove}>
            삭제
          </button>
        </span>
      </div>
    </div>
  );
}

export default Checklist;
