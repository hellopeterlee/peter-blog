---
slug: hubei-eroad
title: 湖北E路通
date: 2025-05-05
authors: peterlee
tags: [project, web]
keywords: [project, web]
description: 湖北E路通
image: /img/project/hubei-eroad.png
---

湖北省移动公司专门针对车辆的“车务通子系统”,实现对车辆位置进行定位和管理; 实时监控车辆运行信息，实时显示所在位置，并回话历史轨迹; 车辆定位功能，隐私管理，二次鉴权
<!-- truncate -->

## 技术架构
▌ 后端引擎
* 基于Spring+Struts+Hibernate企业级框架的三层架构
* 采用SOA理念设计WebService接口集群，支持千万级终端并发接入
* 分布式空间数据引擎优化海量轨迹存储与检索

▌ 智能GIS客户端
* Delphi+Mapx 开发GIS客户端，支持海量轨迹数据展示与检索


年代太久，截图已经找不到了

## 随便来几张代码截图
![](/img/project/hubei-eroad.png)


~~~pas

# LBSService.pas
// ************************************************************************ //
// The types declared in this file were generated from data read from the
// WSDL File described below:
// WSDL     : http://localhost:8080/LBS/services/LBSService?wsdl
// Encoding : UTF-8
// Version  : 1.0
// (2008-6-17 15:24:16 - 1.33.2.5)
// ************************************************************************ //

unit LBSService;

interface

uses InvokeRegistry, SOAPHTTPClient, Types, XSBuiltIns ,IniFiles,SysUtils,Forms;

type

  // ************************************************************************ //
  // The following types, referred to in the WSDL document are not being represented
  // in this file. They are either aliases[@] of other types represented or were referred
  // to but never[!] declared in the document. The types from the latter category
  // typically map to predefined/known XML or Borland types; however, they could also 
  // indicate incorrect WSDL documents that failed to declare or import a schema type.
  // ************************************************************************ //
  // !:string          - "http://www.w3.org/2001/XMLSchema"
  // !:int             - "http://www.w3.org/2001/XMLSchema"

  Customer             = class;                 { "http://entity.prl.com" }



  // ************************************************************************ //
  // Namespace : http://entity.prl.com
  // ************************************************************************ //
  Customer = class(TRemotable)
  private
    Fbalance: Integer;
    Femail: WideString;
    Fid: Integer;
    Fname: WideString;
    Fpassword: WideString;
  published
    property balance: Integer read Fbalance write Fbalance;
    property email: WideString read Femail write Femail;
    property id: Integer read Fid write Fid;
    property name: WideString read Fname write Fname;
    property password: WideString read Fpassword write Fpassword;
  end;


  // ************************************************************************ //
  // Namespace : http://webservice.prl.com
  // transport : http://schemas.xmlsoap.org/soap/http
  // style     : document
  // binding   : LBSServiceHttpBinding
  // service   : LBSService
  // port      : LBSServiceHttpPort
  // URL       : http://localhost:8080/LBS/services/LBSService
  // ************************************************************************ //
  LBSServicePortType = interface(IInvokable)
  ['{F21FED0F-9B8F-2103-11F2-A8E1E78C0BC5}']
    function  validateCustomer(const in0: WideString; const in1: WideString): Customer; stdcall;
    function  test: Integer; stdcall;
  end;

function GetLBSServicePortType(UseWSDL: Boolean=System.False; Addr: string=''; HTTPRIO: THTTPRIO = nil): LBSServicePortType;


implementation

uses UntIniOptions;

function GetLBSServicePortType(UseWSDL: Boolean; Addr: string; HTTPRIO: THTTPRIO): LBSServicePortType;
const
  defSvc  = 'LBSService';
  defPrt  = 'LBSServiceHttpPort';
var
  RIO: THTTPRIO;
  defWSDL,defURL:String;
begin
  Result := nil;

  defWSDL:=IniOptions.SystemWSDL;
  defURL:=IniOptions.SystemURL;

  if (Addr = '') then
  begin
    if UseWSDL then
      Addr := defWSDL
    else
      Addr := defURL;
  end;
  if HTTPRIO = nil then
    RIO := THTTPRIO.Create(nil)
  else
    RIO := HTTPRIO;
  try
    Result := (RIO as LBSServicePortType);
    if UseWSDL then
    begin
      RIO.WSDLLocation := Addr;
      RIO.Service := defSvc;
      RIO.Port := defPrt;
    end else
      RIO.URL := Addr;
  finally
    if (Result = nil) and (HTTPRIO = nil) then
      RIO.Free;
  end;
end;


initialization
  InvRegistry.RegisterInterface(TypeInfo(LBSServicePortType), 'http://webservice.prl.com', 'UTF-8');
  InvRegistry.RegisterDefaultSOAPAction(TypeInfo(LBSServicePortType), '');
  InvRegistry.RegisterInvokeOptions(TypeInfo(LBSServicePortType), ioDocument);
  InvRegistry.RegisterExternalParamName(TypeInfo(LBSServicePortType), 'validateCustomer', 'out_', 'out');
  InvRegistry.RegisterExternalParamName(TypeInfo(LBSServicePortType), 'test', 'out_', 'out');
  RemClassRegistry.RegisterXSClass(Customer, 'http://entity.prl.com', 'Customer');

end. 
~~~

~~~pas
unit UntMapFeatureFlasher;

{
  �������б��е�Feature������˸Ч��
  AddElement���б�������Ҫ��˸��feature,Ȼ��Enabled:=True;
}

interface

uses
  ExtCtrls,MapXLib_TLB,Windows,OleCtrls,SysUtils,UntMapXFeatureSetImpl
  ,UntInterfaceMapXFeatureSet,UntInterfaceMapXFeatureIterator,
  UntInterfaceFlashLayerAware;

type
  TMapFeatureFlasher = class(TObject)
  private
    FTimer:TTimer;
    FMap:TMap;
    FBusy : Boolean;
    bCenter:Boolean;
    FInterval: Cardinal;
    FFlashLayer: CMapXLayer;
    FFlashSel:Boolean;
    FMapXFeatures:TMapXFeatureSet;
    FMapXFeatureInterator:IMapXFeatureIterator;
    FPostion:Integer;
    FFlashLayerAware:IFlashLayerAware;
    procedure OnTimer(Sender:TObject);
    procedure SetInterval(Value:Cardinal);
    procedure SetEnabled(Value:Boolean);
  public
    constructor Create(BMap:TMap;BFlashLayerAware:IFlashLayerAware);
    function AddElement(E:CMapXFeature):CMapXFeature;
    procedure RemoveElement(E:CMapXFeature);
  published
    property Interval:Cardinal read FInterval write SetInterval;
    property Enabled : Boolean write SetEnabled;
  end;   

implementation

uses PublicUtil, UntMapModule, CnDebug;

{ TMapFeatureFlasher }

constructor TMapFeatureFlasher.Create(BMap:TMap;BFlashLayerAware:IFlashLayerAware);
begin
  CnDebugger.TraceMsg('TMapFeatureFlasher.Create');
  FMap := BMap;
  FFlashLayerAware := BFlashLayerAware;

  if (-1 = TMapModule.GetLayerIndex(FMap, LAYER_FLASH)) then
  begin
    FFlashLayer := TMapModule.CreateTempAnimationLayer(FMap, LAYER_FLASH);
    FFlashLayer.AutoLabel := True;
    if(Assigned(FFlashLayerAware)) then FFlashLayerAware.SetFlashLayer(FFlashLayer);
  end else
    FFlashLayer := FMap.Layers.Item[LAYER_FLASH];

  FMapXFeatures := TMapXFeatureSet.Create;
  FMapXFeatures.FlashLayer := FFlashLayer;
  FMapXFeatures.AddAll(FFlashLayer.NoFeatures); 
  FMapXFeatureInterator:=FMapXFeatures.Iterator;

  FTimer := TTimer.Create(nil);
  FTimer.Enabled:=False;
  FTimer.OnTimer := OnTimer;
  FTimer.Interval := 2000;
  FBusy := False;
  bCenter := False;
  FPostion := 1;
end;

procedure TMapFeatureFlasher.SetEnabled(Value: Boolean);
begin
  FTimer.Enabled := Value;
end;

procedure TMapFeatureFlasher.SetInterval(Value: Cardinal);
begin
  FTimer.Interval := Value;
  FInterval := Value;
end;

procedure TMapFeatureFlasher.OnTimer(Sender: TObject);
var
  A:CMapXFeature;
begin

  //CnDebugger.TraceMsg('TMapFeatureFlasher.OnTimer');

  if(FBusy) then
  begin
    Sleep(FTimer.Interval);
    Exit;
  end;

  FBusy := True;

  FMapXFeatureInterator.MoveFirst;
  FFlashLayer.Selection.ClearSelection;
  
  if not FFlashSel then
  begin
    CnDebugger.TraceMsg('Enter While');
    FFlashLayer.Selection.Replace( FMapXFeatures.GetAll );
    if not bCenter then
    begin
      FMap.CenterX := FMapXFeatures.GetAt(FMapXFeatures.Count).CenterX;
      FMap.CenterY := FMapXFeatures.GetAt(FMapXFeatures.Count).CenterY;
      FMap.Refresh;
      bCenter := True;
      FFlashLayer.LabelAtPoint(FMap.CenterX,FMap.CenterY);
    end;
  end else
  begin
    CnDebugger.TraceMsg('Selection.ClearSelection');
    FFlashLayer.Selection.ClearSelection;
  end;

  FFlashSel := not FFlashSel;   
  FBusy := False;
end;


function TMapFeatureFlasher.AddElement(E: CMapXFeature): CMapXFeature;
var
  newObj:CMapXFeature;
begin
  try
    newObj := FFlashLayer.AddFeature(E, EmptyParam);
    CnDebugger.TraceMsg('FMapXFeatures.add begin '+ IntToStr(newObj.FeatureID));
    FMapXFeatures.Add(newObj);
    CnDebugger.TraceMsg('FMapXFeatures.add end');
//    FMapXFeatureInterator.MoveFirst;
    Result:=newObj;
  except

  end;          
end;

procedure TMapFeatureFlasher.RemoveElement(E: CMapXFeature);
begin
  try
    Enabled:=False;
    FMapXFeatures.Remove(E);
    FFlashLayer.DeleteFeature(E);
    FFlashLayer.Pack(miPackData); 
  finally
    FMapXFeatureInterator.MoveFirst;
  end;        

end;

end.

~~~