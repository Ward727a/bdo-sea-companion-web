/**
 * @file Application.tsx
 * @description This file contains the main component of the application.
 * @author Ward
 * @version 0.0.3
 * @license GPL-3.0
 * @since 0.0.1
 */

import React from 'react';
import './Application.scss';

import {HashRouter,NavLink,Route, Routes, Navigate} from "react-router-dom";

import AppCarack from "@components/carrack/AppCarrack";
import AppBarter from "@components/barter/AppBarter";
import dataDict from '@src/typings/data';
import LangPage from './lang_page/lang_page';
import SettingTier from './setting-tier/settingTier';
import ChangeLog from './changeLog/changelog';
import Advice from './advice/advice';
import Notice from './notice/notice';
import Reset from './reset/reset';


// Define the props
type Props = {
  data: dataDict;
}

// Create the component to render
/**
 * @description This is the main component of the application, it contains the navigation bar and the routes.
 * @param props the props of the component, type: {@link Props}
 * @returns the component to render, type: {@link React.FC}
 */
const Application: React.FC<Props> = (props: Props) => {

  // Prevent the default behavior of the drag and drop
  document.addEventListener('dragover', (e: DragEvent) => {
    e.preventDefault();
    return false;
  }, false);

  document.addEventListener("drop", (e: DragEvent) => {
    e.preventDefault();
  });

  document.addEventListener("dragenter", (e: DragEvent) => {
    e.preventDefault();
    // Change the cursor 
    e.dataTransfer.dropEffect = "move";
  });

  // Return the component to render
  return (
    <div id='erwt'>
      <LangPage data={props.data}/>
      <SettingTier data={props.data}/>
      <ChangeLog changelog={props.data.changelog} update={props.data.update}/>
      <Notice data={props.data}/>

      <Reset data={props.data}/>
      
      <HashRouter>
      
        <div id='app'>
          <div id='app-header'>
            <nav>
              <NavLink className={({ isActive }) => isActive ? "activeLink" : "link" } to="/barter">{props.data.lang.navigation[0].barter[0]}</NavLink>
              <NavLink className={({ isActive }) => isActive ? "activeLink" : "link" } to="/carrack">{props.data.lang.navigation[0].carrack[0]}</NavLink>
              <Advice version={props.data.changelog.version}/>
            </nav>
          </div>
          <div id='app-content'>
            <Routes>
              <Route path="/" element={<Navigate to="/barter" replace/>}/>
              <Route path="/barter" element={<AppBarter data={props.data}/>}/>
              <Route path="/carrack" element={<AppCarack data={props.data}/>}/>
            </Routes>
          </div>
        </div>
      
      </HashRouter>
    
    </div>
  );
};

export default Application;
