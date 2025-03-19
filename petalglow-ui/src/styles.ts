import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  :root {
    font-family: "Roboto", sans-serif;
    line-height: 1.5;
    font-weight: 400;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    width: 100%;
    height: 100%;
  }

  body {
    margin: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;
