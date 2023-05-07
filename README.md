[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/JJ3jryix)

# HW5 Starting Code

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# 姓名

-   羅寶瑩
-   Po Ying, Law

# 實作的網站

> 你所實作的網站如何被測試

**Please enter the following URL to test.**
https://gleeful-malabi-04596c.netlify.app/

# 加分作業項目

> 你所實作的加分作業項目，以及如何觸發它

## 對所有與線條相關的操作提供撤銷/重做功能（最多在此作業中+5 分）

-   The following actions can be undone and redone.

    -   Draw a line.
    -   Delete a line.
    -   Changing the border color of the selected line will be added to the command list stack.

-   The following actions **cannot** be undone and redone.
    -   Changing the fill color of the selected line will **not** be added to the command list stack.
  
![1683449907020](https://user-images.githubusercontent.com/30721578/236669645-302b9e4b-9438-416b-bb8e-006fb67409f9.gif)

## 撤銷、重作鍵盤快捷鍵實現 （每個+1，最多在本作業中+2 分）

-   Press Ctrl+Z to undo.
-   Press Ctrl+Y to redo.

## 增加命令列表區塊（最多在此作業中+5 分）

-   當前操作、將未完成（撤銷且可被重做）的操作顯示為灰色
    - ![image](https://user-images.githubusercontent.com/30721578/236669659-49fcb747-9e5b-4160-80a2-aef2c9e4c6a7.png)
-   應該刪除「由於撤消之後進行新操作，而不可被重做」的操作
    - ![1683450186402](https://user-images.githubusercontent.com/30721578/236669680-1a3becb4-e135-40fe-b9fd-6700c9ecbc70.gif)

# 困難之處

> 認為此作業最難實作的部分與原因

1. Understanding the sample code:
   One of the difficulties in this assignment is understanding the provided sample code. It is important to comprehend how the program works and how the command object and list are manipulated in order to write code without encountering errors.

2. Handling repeated trigger actions:
   When dealing with actions such as **changing the border width (slider)** and **moving shapes**, it's important to address the issue of continuous triggering in the `changeCurrBorderColor()` and `moveShape()` functions. To prevent the creation of a large number of command objects and to ensure proper functionality for redoing actions, it is necessary to create a separate function. This function should be called after the moving or changing action has been completed.

# 有趣內容

> 其他與軟體設計相關之感興趣內容

-   Due to testing, it was found that when the command object becomes too long, it exceeds the boundary. Therefore, a scroll bar has been added.
![1683451673048](https://user-images.githubusercontent.com/30721578/236669692-1916cf8f-752d-434f-bda0-fc9714d2a9aa.gif)

