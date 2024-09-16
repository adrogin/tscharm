controladdin "Live Bars"
{
    VerticalStretch = true;
    VerticalShrink = true;
    HorizontalStretch = true;
    HorizontalShrink = true;
    RequestedHeight = 500;
    MinimumHeight = 500;
    RequestedWidth = 1100;

    Scripts = 'Scripts/dist/main.js';
    StyleSheets = 'Scripts/stylesheets/chart.css';

    procedure CreateChart(Width: Integer; Height: Integer);
    procedure ShowLabels();
    procedure SetXAxisMarks(Marks: JsonArray);
    procedure SetYAxisMarks(Marks: JsonArray);
    procedure AddNewLine();
    procedure RemoveLine(Index: Integer);
    procedure SetLineLabel(Index: Integer; Label: Text);
    procedure SetAllLineLabels(Labels: JsonArray);
    procedure AddBar(LineIndex: Integer; Position: Integer; Width: Integer; ClassName: Text);
    procedure RemoveBar(LineIndex: Integer; BarIndex: Integer);
    procedure BindBarEvents();
    procedure Draw();
    procedure Clear();

    event OnResizeLeftDone(BarId: Text; NewPosition: Integer);
    event OnResizeRightDone(BarId: Text; NewWidth: Integer);
    event OnDragDone(BarId: Text; NewPosition: Integer);
}
