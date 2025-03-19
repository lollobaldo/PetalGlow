import React from "react";
import styled from "styled-components";

const StyledTabIndicator = styled.div<any>`
  /* position: absolute; */
  width: ${(props) => 100 / props.$tabCount}%;
  top: 100%;
  left: 0;

  transform: translate(${(props) => props.$offset}, -100%);

  transition: transform ${(props) => props.$duration}ms;

  border-top-style: solid;
  border-top-width: 1px;
`;

const StyledTab = styled.li<any>`
  flex: 1;
  height: 100%;

  button {
    cursor: pointer;
    transition: color 0.3s;
    color: ${(props) => (props.$isFocused ? "#000" : "#777")};
    border: none;
    width: 100%;
    height: 100%;
    font-size: large;

    background-color: rgba(0, 0, 0, 0);
  }
`;

export const Tab = ({ title, onClick, isFocused }: any) => {
  return (
    <StyledTab onClick={onClick} $isFocused={isFocused}>
      <button>{title}</button>
    </StyledTab>
  );
};

const StyledTabs = styled.div`
  position: relative;
  list-style: none;
  height: 30px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 16px;
  font-size: larger;
`;

export const Tabs = ({ focusedIdx, children, onChange, duration = 300 }: any) => {
  return (
    <StyledTabs>
      {React.Children.map(children, (child, i) =>
        React.cloneElement(child, {
          key: i,
          isFocused: focusedIdx === i,
          onClick: (e) => {
            onChange(i);
          }
        })
      )}
      <StyledTabIndicator
        $duration={duration}
        $tabCount={children.length}
        $offset={`${100 * focusedIdx}%`}
      />
    </StyledTabs>
  );
};
const StyledOuterSliders = styled.div`
  overflow: hidden;
`;
const StyledSliders = styled.div<any>`
  display: flex;
  flex-wrap: nowrap;
  align-items: start;
  width: 100%;

  transform: translateX(${(props) => `${props.$offset}%`});
  transition: transform ${(props) => props.$duration}ms;

  & > div {
    flex-shrink: 0;
    width: 100%;
  }
`;

export const Sliders = ({ focusedIdx, children, duration = 300 }: any) => {
  const offset = -100 * focusedIdx;

  return (
    <StyledOuterSliders>
      <StyledSliders $offset={offset} $duration={duration}>
        {children}
      </StyledSliders>
    </StyledOuterSliders>
  );
};
