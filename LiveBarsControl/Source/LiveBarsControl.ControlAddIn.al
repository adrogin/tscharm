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
    procedure AddNewLine();
    procedure RemoveLine(Index: Integer);
    procedure AddBar(LineIndex: Integer; Position: Integer; Width: Integer; ClassName: Text);
    procedure RemoveBar(LineIndex: Integer; BarIndex: Integer);
    procedure Draw();
}
