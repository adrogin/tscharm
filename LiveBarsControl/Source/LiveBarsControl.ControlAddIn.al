controladdin "Live Bars"
{
    VerticalStretch = true;
    VerticalShrink = true;
    HorizontalStretch = true;
    HorizontalShrink = true;
    RequestedHeight = 500;
    MinimumHeight = 500;

    Scripts = 'Scripts/dist/main.js';
    StyleSheets = 'Scripts/stylesheets/chart.css';

    procedure CreateChart(Width: Integer; Height: Integer);
    procedure ShowLabels();
    procedure AddNewLine();
    procedure RemoveLine(Index: Integer);
    procedure AddBar(LineIndex: Integer; Position: Integer; Width: Integer; ClassName: Text);
    procedure RemoveBar(LineIndex: Integer; BarIndex: Integer);
    procedure BindBarEvents();
    procedure Draw();

    event OnResizeLeftDone(BarId: Text; NewPosition: Integer);
    event OnResizeRightDone(BarId: Text; NewWidth: Integer);
    event OnDragDone(BarId: Text; NewPosition: Integer);
}
