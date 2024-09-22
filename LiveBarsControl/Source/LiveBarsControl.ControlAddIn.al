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
    procedure SetXAxisMarks(Marks: JsonArray);
    procedure AddNewLine();
    procedure RemoveLine(Index: Integer);
    procedure SetLineLabel(Index: Integer; Label: Text);
    procedure SetAllLineLabels(Labels: JsonArray);
    procedure AddBar(LineIndex: Integer; Position: Integer; Width: Integer; ClassName: Text);
    procedure RemoveBar(LineIndex: Integer; BarIndex: Integer);
    procedure BindBarEvents();
    procedure Draw();
    procedure Clear();
    procedure SetScale(MinValue: Integer; MaxValue: Integer);
    procedure RequestDocumentSize();

    event OnResizeLeftDone(LineId: Integer; BarId: Integer; NewPosition: Integer);
    event OnResizeRightDone(LlineId: Integer; BarId: Integer; NewWidth: Integer);
    event OnDragDone(LineId: Integer; BarId: Integer; NewPosition: Integer);
    event OnDocumentSizeReceived(Width: Integer; Height: Integer);
}
