TwosideMultiSelectwithDragNDrop
===============================

Two sided multi select drag and drop javascript plugin

1   About:
This document gives the information required to integrate the “Two Sided Multi Draggable Component” into the html with the help of attached .js and .css files.
2   Description:
Two Sided Multi Draggable Component, as the name suggests, this component is used for dragging list of apps from one list to another in both directions.
3   Frameworks used:
1.  jQuery JavaScript Library v1.8.3
2.	jQuery UI - v1.9.2
4   Features present:
Following are the features provided by this component:
1.	Drag single/Multiple apps from one list to another list.
2.	Selection of multiple list apps using ‘Ctrl+mouse click’ and ‘shift+mouse click’.
3.	Right and Left Arrow buttons to move single/multiple apps between the lists.
4.	Up and Down arrows for second list for moving the position of an app within the list.
5.	Restrict to maximum number of apps present in second list.

5   How to integrate:
1.	Include the .js and .css provided by this component.
2.	Create a container HTML Div element in the html file where this component is to be used. For example:
        <div id=" draggableContainer"></div>
3.	Call the initialization method “multiDraggableComponent()” on this div with appropriate parameters. For example:
         document.getElementById('# draggableContainer).multiDraggableComponent({ availableApps: [], selectedApps: [], moveOptions: true/false, maxSelected: Number });
There are four parameters used while calling the method:
a.	availableApps: This represents array of apps that should be present on the left side list of the component. This doesn’t have any maximum number of apps limit.
b.	selectedApps: This represents array of apps that should be present on the right side list of the component. This has maximum number of apps limitation.
c.	moveOptions: This boolean value represents the presence of Up and Down arrows that are used to move the app top or bottom in the same list.
d.	maxSelected: This integer value represents the maximum number of apps that should be present in the second list of apps.

