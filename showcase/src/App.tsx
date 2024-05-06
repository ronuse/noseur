import React from 'react';
import {
    Button, Dialog, ChartData,
    TextInput, Dropdown, Scheme, Month, YearInput, MonthInput,
    AlertInterface, alertPopover, loadingAlert, DateInput, TimeInput,
    MoneyInput, EmailInput, PasswordInput, alertDialog, DateTimeInput, Message,
    TextAreaInput, NumberInput, NoseurObject, ComposedPassword, YearPicker, MonthPicker, MessageSchemesIcons, RadioButton,
    Checkbox, Alignment, ProgressBar, ProgressBarMode, NoseurNummber, FormControl, Paginator, FileInputManageRef, Messages, MessagesManageRef, ToastManageRef, Toast, Toaster, Transition, Panel, PanelManageRef, Accordion, AccordionTab, AccordionManageRef, TabPane, TabPanel, TabPaneManageRef,
    Popover, Portal, Table, Column, PaginatorPageChangeOption, SortMode, Chart, ChartType, AlertDialog, AlertPopover, ViewportSensor, Orientation, List, InputManageRef, FileInput, FileInputMode, DateTimePicker, Weekday, DateTimePickerSelectionMode, TimePicker, DatePicker, DateTimePickerLayoutElement, DateTimePickerLayout, DateTimePickerMode, DateTimePickerType, Position, ScrollPanel, MessageSpinnerIcons,
} from "@ronuse/noseur";

function App() {
    let progress = React.useRef(0);
    const schemes = Object.values(Scheme);
    const onOpenRef = React.useRef<any>();
    const onCloseRef = React.useRef<any>();
    const chatSenderRef = React.useRef<any>();
    const [state, setState] = React.useState(false);
    const inputManageRef = React.useRef<any>(null);
    const toastManageRef = React.useRef<ToastManageRef>(null);
    const panelManageRef = React.useRef<PanelManageRef>(null);
    const tabPaneManageRef = React.useRef<TabPaneManageRef>(null);
    const [charty, setCharty] = React.useState<any>(ChartType.BAR);
    const messagesManageRef = React.useRef<MessagesManageRef>(null);
    const accordionManageRef = React.useRef<AccordionManageRef>(null);
    const fileInpuManagetRef = React.useRef<FileInputManageRef>(null);
    const [showDialog, setShowDialog] = React.useState<boolean>(false);
    const [inputIsValid, setInputIsValid] = React.useState<boolean>(false);
    const [dropdownIsValid, setDropdownIsValid] = React.useState<boolean>(false);
    const [showRivtnDialog, setShowRivtnDialog] = React.useState<boolean>(false);
    const [showAlertDialog, setShowAlertDialog] = React.useState<boolean>(false);
    const [showAlertPopover, setShowAlertPopover] = React.useState<boolean>(false);
    const [transition, setTransition] = React.useState<Transition>(Transition.SLIDE);
    const refs = React.useRef<NoseurObject<any>>({ "input1": { current: undefined } });
    const [dialogAlignment, setDialogAlignment] = React.useState<Alignment>(Alignment.CENTER);
    const [dynamicDataTable, setDynamicDataTable] = React.useState<number[]>(Array(5).fill(0));
    const [tabpaneAlignment, setTabpaneAlignment] = React.useState<Alignment>(Alignment.TOP_LEFT);

    const percent = (index: number): number => (index * 100) / schemes.length + 2;

    /*React.useEffect(() => {
        if (progress.current < 100) setTimeout(() => {
            setState(!state);
            progress.current += 7;
        }, 1000);
    }, [state]);*/

    const loadingD = loadingAlert({
        message: "Hello World",
        onLoading: async (alert: AlertInterface) => {
            setTimeout(() => {
                alert.doneLoading();
            }, 5000);
            return false;
        }
    });

    // leftLayout="CustomElementer DaysElements"
    // leftLayout='NowElement IncrementElement TimeSeperator DecrementElement HourElement TimeSeperator MinutesElement TimeSeperator SecondsElement TimeSeperator MeridianElement WeekdaysElements DaysElements TodaysDateElement SelectedDatesElements'
    function render() {
        return (
            <div className="Apps" style={{ background: "white" }}>
                <div style={{ margin: 30 }}>
                    Data Manage Ref multiRowExpansion
                    <br />
                    <Button scheme={Scheme.PRIMARY} text="Toggle 1" onClick={() => refs.current["dm-list-expansion-2"].toggleContent(1)}/>
                    <Button scheme={Scheme.PRIMARY} text="Expand 1" onClick={() => refs.current["dm-list-expansion-2"].expandContent(1)}/>
                    <Button scheme={Scheme.PRIMARY} text="Collapse 1" onClick={() => refs.current["dm-list-expansion-2"].collapseContent(1)}/>
                    <br />
                    <Button scheme={Scheme.PRIMARY} text="Toggle 2" onClick={() => refs.current["dm-list-expansion-2"].toggleContent(2)}/>
                    <Button scheme={Scheme.PRIMARY} text="Expand 2" onClick={() => refs.current["dm-list-expansion-2"].expandContent(2)}/>
                    <Button scheme={Scheme.PRIMARY} text="Collapse 2" onClick={() => refs.current["dm-list-expansion-2"].collapseContent(2)}/>
                    <br />
                    <Button scheme={Scheme.PRIMARY} text="Toggle 3" onClick={() => refs.current["dm-list-expansion-2"].toggleContent(3)}/>
                    <Button scheme={Scheme.PRIMARY} text="Expand 3" onClick={() => refs.current["dm-list-expansion-2"].expandContent(3)}/>
                    <Button scheme={Scheme.PRIMARY} text="Collapse 3" onClick={() => refs.current["dm-list-expansion-2"].collapseContent(3)}/>
                    <br /><br />
                    <List multiRowExpansion manageRef={(m: any) => refs.current["dm-list-expansion-2"] = m} rowExpansionTemplate={(data) => {
                        return (<div style={{ background: "red" }}>Element Number {data.one} -  {data.two}</div>);
                    }} data={[{ one: "1", two: "1" }, { one: "2", two: "22" }, { one: "3", two: "333" }]}
                        stripedRows showGridlines={true} style={{ marginTop: 20 }}
                        template={(d: any, r: any) => (<div><Button text="Toggle" onClick={r.toggleContent} /> {d.one} --- {d.two} </div>)} />
                    <br />
                    <hr />
                    <br />
                    Data Manage Ref
                    <br />
                    <Button scheme={Scheme.PRIMARY} text="Toggle 1" onClick={() => refs.current["dm-list-expansion"].toggleContent(1)}/>
                    <Button scheme={Scheme.PRIMARY} text="Expand 1" onClick={() => refs.current["dm-list-expansion"].expandContent(1)}/>
                    <Button scheme={Scheme.PRIMARY} text="Collapse 1" onClick={() => refs.current["dm-list-expansion"].collapseContent(1)}/>
                    <br />
                    <Button scheme={Scheme.PRIMARY} text="Toggle 2" onClick={() => refs.current["dm-list-expansion"].toggleContent(2)}/>
                    <Button scheme={Scheme.PRIMARY} text="Expand 2" onClick={() => refs.current["dm-list-expansion"].expandContent(2)}/>
                    <Button scheme={Scheme.PRIMARY} text="Collapse 2" onClick={() => refs.current["dm-list-expansion"].collapseContent(2)}/>
                    <br />
                    <Button scheme={Scheme.PRIMARY} text="Toggle 3" onClick={() => refs.current["dm-list-expansion"].toggleContent(3)}/>
                    <Button scheme={Scheme.PRIMARY} text="Expand 3" onClick={() => refs.current["dm-list-expansion"].expandContent(3)}/>
                    <Button scheme={Scheme.PRIMARY} text="Collapse 3" onClick={() => refs.current["dm-list-expansion"].collapseContent(3)}/>
                    <br /><br />
                    <List manageRef={(m: any) => refs.current["dm-list-expansion"] = m} rowExpansionTemplate={(data) => {
                        return (<div style={{ background: "red" }}>Element Number {data.one} -  {data.two}</div>);
                    }} data={[{ one: "1", two: "1" }, { one: "2", two: "22" }, { one: "3", two: "333" }]}
                        stripedRows showGridlines={true} style={{ marginTop: 20 }}
                        template={(d: any, r: any) => (<div><Button text="Toggle" onClick={r.toggleContent} /> {d.one} --- {d.two} </div>)} />
                    <br />
                    <hr />
                    <br />
                    multiRowExpansion
                    <List multiRowExpansion rowExpansionTemplate={(data) => {
                        return (<div style={{ background: "red" }}>Element Number {data.one} -  {data.two}</div>);
                    }} data={[{ one: "1", two: "1" }, { one: "2", two: "22" }, { one: "3", two: "333" }]}
                        stripedRows showGridlines={true} style={{ marginTop: 20 }}
                        template={(d: any, r: any) => (<div><Button text="Toggle" onClick={r.toggleContent} /> {d.one} --- {d.two} </div>)} />
                    <br />
                    <hr />
                    <br />
                    <List rowExpansionTemplate={(data) => {
                        return (<div style={{ background: "red" }}>Element Number {data.one} -  {data.two}</div>);
                    }} data={[{ one: "1", two: "1" }, { one: "2", two: "22" }, { one: "3", two: "333" }]}
                        stripedRows showGridlines={true} style={{ marginTop: 20 }}
                        template={(d: any, r: any) => (<div><Button text="Toggle" onClick={r.toggleContent} /> {d.one} --- {d.two} </div>)} />
                    <br />
                    <hr />
                    <br />
                    multiRowExpansion
                    <List multiRowExpansion rowsContent={{
                        1: "Hello One 1",
                        2: <div style={{ height: 45 }}>Hello Two 22</div>,
                        3: "Hello Three 333",
                    }} data={[{ one: "1", two: "1" }, { one: "2", two: "22" }, { one: "3", two: "333" }]}
                        stripedRows showGridlines={true} style={{ marginTop: 20 }}
                        template={(d: any, r: any) => (<div><Button text="Toggle" onClick={r.toggleContent} /> {d.one} --- {d.two} </div>)} />
                    <br />
                    <hr />
                    <br />
                    <List rowsContent={{
                        1: "Hello One 1",
                        2: <div style={{ height: 45 }}>Hello Two 22</div>,
                        3: "Hello Three 333",
                    }} data={[{ one: "1", two: "1" }, { one: "2", two: "22" }, { one: "3", two: "333" }]}
                        stripedRows showGridlines={true} style={{ marginTop: 20 }}
                        template={(d: any, r: any) => (<div><Button text="Toggle" onClick={r.toggleContent} /> {d.one} --- {d.two} </div>)} />
                </div>
                <div style={{ margin: 30, marginTop: 100 }}>
                    Data Manage Ref multiRowExpansion
                    <br />
                    <Button scheme={Scheme.PRIMARY} text="Toggle 1" onClick={() => refs.current["dm-table-expansion-2"].toggleContent(1)}/>
                    <Button scheme={Scheme.PRIMARY} text="Expand 1" onClick={() => refs.current["dm-table-expansion-2"].expandContent(1)}/>
                    <Button scheme={Scheme.PRIMARY} text="Collapse 1" onClick={() => refs.current["dm-table-expansion-2"].collapseContent(1)}/>
                    <br />
                    <Button scheme={Scheme.PRIMARY} text="Toggle 2" onClick={() => refs.current["dm-table-expansion-2"].toggleContent(2)}/>
                    <Button scheme={Scheme.PRIMARY} text="Expand 2" onClick={() => refs.current["dm-table-expansion-2"].expandContent(2)}/>
                    <Button scheme={Scheme.PRIMARY} text="Collapse 2" onClick={() => refs.current["dm-table-expansion-2"].collapseContent(2)}/>
                    <br />
                    <Button scheme={Scheme.PRIMARY} text="Toggle 3" onClick={() => refs.current["dm-table-expansion-2"].toggleContent(3)}/>
                    <Button scheme={Scheme.PRIMARY} text="Expand 3" onClick={() => refs.current["dm-table-expansion-2"].expandContent(3)}/>
                    <Button scheme={Scheme.PRIMARY} text="Collapse 3" onClick={() => refs.current["dm-table-expansion-2"].collapseContent(3)}/>
                    <br /><br />
                    <Table multiRowExpansion manageRef={(m: any) => refs.current["dm-table-expansion-2"] = m} data={[{ one: "1", two: "1" }, { one: "2", two: "22" }, { one: "3", two: "333" }]} rowExpansionTemplate={(data) => {
                        return (<div style={{ background: "red" }}>Element Number {data.one} -  {data.two}</div>);
                    }}>
                        <Column dataKey='one' header="One" />
                        <Column dataKey='two' header="Two" />
                    </Table>
                    <br />
                    <hr />
                    <br />
                    Data Manage Ref
                    <br />
                    <Button scheme={Scheme.PRIMARY} text="Toggle 1" onClick={() => refs.current["dm-table-expansion"].toggleContent(1)}/>
                    <Button scheme={Scheme.PRIMARY} text="Expand 1" onClick={() => refs.current["dm-table-expansion"].expandContent(1)}/>
                    <Button scheme={Scheme.PRIMARY} text="Collapse 1" onClick={() => refs.current["dm-table-expansion"].collapseContent(1)}/>
                    <br />
                    <Button scheme={Scheme.PRIMARY} text="Toggle 2" onClick={() => refs.current["dm-table-expansion"].toggleContent(2)}/>
                    <Button scheme={Scheme.PRIMARY} text="Expand 2" onClick={() => refs.current["dm-table-expansion"].expandContent(2)}/>
                    <Button scheme={Scheme.PRIMARY} text="Collapse 2" onClick={() => refs.current["dm-table-expansion"].collapseContent(2)}/>
                    <br />
                    <Button scheme={Scheme.PRIMARY} text="Toggle 3" onClick={() => refs.current["dm-table-expansion"].toggleContent(3)}/>
                    <Button scheme={Scheme.PRIMARY} text="Expand 3" onClick={() => refs.current["dm-table-expansion"].expandContent(3)}/>
                    <Button scheme={Scheme.PRIMARY} text="Collapse 3" onClick={() => refs.current["dm-table-expansion"].collapseContent(3)}/>
                    <br /><br />
                    <Table manageRef={(m: any) => refs.current["dm-table-expansion"] = m} data={[{ one: "1", two: "1" }, { one: "2", two: "22" }, { one: "3", two: "333" }]} rowExpansionTemplate={(data) => {
                        return (<div style={{ background: "red" }}>Element Number {data.one} -  {data.two}</div>);
                    }}>
                        <Column dataKey='one' header="One" />
                        <Column dataKey='two' header="Two" />
                    </Table>
                    <br />
                    <hr />
                    <br />
                    multiRowExpansion
                    <Table multiRowExpansion data={[{ one: "1", two: "1" }, { one: "2", two: "22" }, { one: "3", two: "333" }]} rowExpansionTemplate={(data) => {
                        return (<div style={{ background: "red" }}>Element Number {data.one} -  {data.two}</div>);
                    }}>
                        <Column template={(_, rowControlOptions) => <i style={{ cursor: "pointer" }} className="fa fa-angle-right" onClick={() => {
                            rowControlOptions?.toggleContent();
                        }} />} />
                        <Column dataKey='one' header="One" />
                        <Column dataKey='two' header="Two" />
                    </Table>
                    <br />
                    <hr />
                    <br />
                    <Table data={[{ one: "1", two: "1" }, { one: "2", two: "22" }, { one: "3", two: "333" }]} rowExpansionTemplate={(data) => {
                        return (<div style={{ background: "red" }}>Element Number {data.one} -  {data.two}</div>);
                    }}>
                        <Column template={(_, rowControlOptions) => <i style={{ cursor: "pointer" }} className="fa fa-angle-right" onClick={() => {
                            rowControlOptions?.toggleContent();
                        }} />} />
                        <Column dataKey='one' header="One" />
                        <Column dataKey='two' header="Two" />
                    </Table>
                    <br />
                    <hr />
                    <br />
                    multiRowExpansion
                    <Table multiRowExpansion rowsContent={{
                        1: "Hello One 1",
                        2: <div style={{ height: 45 }}>Hello Two 22</div>,
                        3: "Hello Three 333",
                    }} data={[{ one: "1", two: "1" }, { one: "2", two: "22" }, { one: "3", two: "333" }]}>
                        <Column template={(_, rowControlOptions) => <i style={{ cursor: "pointer" }} className="fa fa-angle-right" onClick={() => {
                            rowControlOptions?.toggleContent();
                        }} />} />
                        <Column dataKey='one' header="One" />
                        <Column dataKey='two' header="Two" />
                    </Table>
                    <br />
                    <hr />
                    <br />
                    <Table rowsContent={{
                        1: "Hello One 1",
                        2: <div style={{ height: 45 }}>Hello Two 22</div>,
                        3: "Hello Three 333",
                    }} data={[{ one: "1", two: "1" }, { one: "2", two: "22" }, { one: "3", two: "333" }]}>
                        <Column template={(_, rowControlOptions) => <i style={{ cursor: "pointer" }} className="fa fa-angle-right" onClick={() => {
                            rowControlOptions?.toggleContent();
                        }} />} />
                        <Column dataKey='one' header="One" />
                        <Column dataKey='two' header="Two" />
                    </Table>
                </div>
                <div style={{ margin: 30 }}>
                    {Object.keys(Scheme).map((scheme, index) => (
                        <ScrollPanel key={scheme} scroller={{ trackWidth: 5 }}
                            scheme={schemes[index]} style={{ flex: 1, width: "400px", height: "300px", marginBottom: 30 }}>
                            {scheme} {basicText()} {basicText()} {basicText()} {basicText()} {basicText()} {basicText()} {basicText()}
                        </ScrollPanel>
                    ))}
                    <br />
                    <ScrollPanel style={{ flex: 1, width: "400px", height: "300px" }} alwaysScroll hideScrollBarY>
                        {basicText()} {basicText()} {basicText()} {basicText()} {basicText()} {basicText()} {basicText()}
                    </ScrollPanel>
                    <br />
                    <ScrollPanel style={{ flex: 1, width: "400px", height: "300px" }} alwaysScroll hideScrollBarX>
                        {basicText()} {basicText()} {basicText()} {basicText()} {basicText()} {basicText()} {basicText()}
                    </ScrollPanel>
                    <br />
                    <ScrollPanel style={{ flex: 1, width: "400px", height: "300px" }} alwaysScrollY>
                        {basicText()} {basicText()} {basicText()} {basicText()} {basicText()} {basicText()} {basicText()}
                    </ScrollPanel>
                    <br />
                    <ScrollPanel style={{ flex: 1, width: "400px", height: "300px" }} alwaysScrollX>
                        {basicText()} {basicText()} {basicText()} {basicText()} {basicText()} {basicText()} {basicText()}
                    </ScrollPanel>
                    <br />
                    <ScrollPanel style={{ flex: 1, width: "400px", height: "300px" }} isForm onSubmit={(e) => console.log("Yeah")}>
                        {basicText()} {basicText()} {basicText()} {basicText()} {basicText()} {basicText()} {basicText()}
                        <Button text="Submit" />
                    </ScrollPanel>
                    <br />
                    <ScrollPanel style={{ flex: 1, width: "400px", height: "300px" }} hideScrollBars>
                        {basicText()} {basicText()} {basicText()} {basicText()} {basicText()} {basicText()} {basicText()}
                    </ScrollPanel>
                </div>
                <div style={{ margin: 30 }}>
                    <div style={{ margin: 30 }}>
                        <RadioButton />
                        {Object.keys(Scheme).map((scheme, index) => (
                            <RadioButton key={scheme} scheme={schemes[index]} id={schemes[index]} name={"schemed-checkbox"} label={schemes[index]}
                                onChange={(e: any) => console.log(scheme, e.checked, e.value, e.checkState)} />
                        ))}
                        <br />
                        <br />
                        <RadioButton label={"Default"} />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Default Primary"} />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Always Render Input"} id="name" name="user-name" alwaysRenderInput />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Checked"} checked />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Checked = false"} checked={false} />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Disabled"} disabled />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Disabled Checked"} disabled checked />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Read only"} readOnly />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Read only Checked"} readOnly checked />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Required"} required />
                        <RadioButton scheme={Scheme.DANGER} label={"Highlight"} highlight />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Default Checked"} defaultChecked />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Checked Index 0"} checkedIndex={0} />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Checked Index 1"} checkedIndex={1} />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Default Checked Index = 1"} defaultCheckedIndex={1} />
                        <br />
                        <br />
                        <RadioButton toggleable scheme={Scheme.PRIMARY} checkStates={[
                            {
                                icon: null,
                                value: "none",
                                checked: false,
                                scheme: Scheme.NIL,
                            },
                            {
                                value: "up",
                                checked: true,
                                icon: "fa fa-arrow-up",
                                scheme: Scheme.PRIMARY,
                            },
                            {
                                value: "right",
                                checked: true,
                                scheme: Scheme.WARNING,
                                icon: "fa fa-arrow-right",
                            },
                            {
                                value: "down",
                                checked: true,
                                scheme: Scheme.SUCCESS,
                                icon: "fa fa-arrow-down",
                            },
                            {
                                value: "left",
                                checked: true,
                                scheme: Scheme.INFO,
                                icon: "fa fa-arrow-left",
                            },
                        ]} />
                        <br />
                        <br />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Align Label TOP"} alignLabel={Alignment.TOP} />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Align Label LEFT"} alignLabel={Alignment.LEFT} />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Align Label RIGHT"} alignLabel={Alignment.RIGHT} />
                        <RadioButton scheme={Scheme.PRIMARY} label={"Align Label BOTTOM"} alignLabel={Alignment.BOTTOM} />
                    </div>
                </div>
                <div style={{ margin: 30, /*background: "grey", */padding: 20 }}>
                    <div>
                        <Button text="Next" onClick={() => tabPaneManageRef.current?.next()} />
                        <Button text="Prev" onClick={() => tabPaneManageRef.current?.previous()} />
                        <Button text="Switch To 5" onClick={() => tabPaneManageRef.current?.switch(4)} />
                        <Button text="Re Add 3" onClick={() => tabPaneManageRef.current?.readd(2)} />
                        <Button text="Remove 3" onClick={() => tabPaneManageRef.current?.remove(2)} />
                    </div>
                    <br />
                    <TabPane manageRef={tabPaneManageRef} renderActiveTabOnly onTabClose={(index: number) => {
                        console.log("Tab Closed", index);
                    }} onTabActive={(index: number) => {
                        console.log("Tab Active", index);
                    }} onTabChange={(state: string, index: number) => {
                        console.log("Tab Changed", state, index);
                    }}>
                        <TabPanel header="Panel 1">1 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 2">2 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 3">3 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 4">4 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 5">5 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 6">6 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 7">7 - {basicText()}</TabPanel>
                    </TabPane>
                    <br /><br /><br />
                    <TabPane>
                        {[1, 2, 3].map(num => <TabPanel header={`Header ${num}`} headerTemplate={(options: any) => {
                            return (<div style={{ padding: 10, cursor: "pointer", marginRight: 10 }} onClick={options.onClick} className={`${options.scheme}`}>
                                {options.titleElement} Hello
                            </div>)
                        }}>{num} - {basicText()}</TabPanel>)}
                    </TabPane>
                    <br /><br /><br />
                    <TabPane renderActiveTabOnly>
                        <TabPanel header="Panel 1" disabled>1 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 2" disabled>2 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 3" disabled>3 - {basicText()}</TabPanel>
                    </TabPane>
                    <br /><br /><br />
                    <TabPane scheme={Scheme.SKELETON}>
                        <TabPanel header="Panel 1" style={{ margin: 10 }}><div className='noseur-skeleton'>1 - {basicText()}</div></TabPanel>
                        <TabPanel header="Panel 2">2 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 3">3 - {basicText()}</TabPanel>
                    </TabPane>
                    <br /><br /><br />
                    <TabPane>
                        <TabPanel header="Panel 1" scheme={Scheme.SKELETON}>1 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 2">2 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 2">2 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 3" scheme={Scheme.SKELETON}>3 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 3" scheme={Scheme.SKELETON}>3 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 4">4 - {basicText()}</TabPanel>
                    </TabPane>
                    <br /><br /><br />
                    <Dropdown options={Object.keys(Alignment).map((alignment, index) => ({ label: alignment, value: Object.values(Alignment)[index] }))}
                        onSelectOption={(option: any) => {
                            setTabpaneAlignment(option.value);
                            return true;
                        }} selectedOptionIndex={6} formControlProps={{ fill: true }} style={{ width: 100 }} />
                    <br />
                    <TabPane scheme={Scheme.PRIMARY} scrollable alignment={tabpaneAlignment}>
                        <TabPanel header="Panel 1">1 - {basicText()}{basicText()}{basicText()}{basicText()}{basicText()}</TabPanel>
                        <TabPanel header="Panel 2">2 - {basicText()}{basicText()}{basicText()}{basicText()}{basicText()}</TabPanel>
                        <TabPanel header="Panel 3">3 - {basicText()}{basicText()}{basicText()}{basicText()}{basicText()}</TabPanel>
                    </TabPane>
                    <br /><br /><br />
                    <TabPane scrollable>
                        <TabPanel header="Panel 1">1 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 2">2 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 3">3 - {basicText()}</TabPanel>
                    </TabPane>
                    <br /><br /><br />
                    <TabPane scrollable alignment={tabpaneAlignment}>
                        <TabPanel header="Panel 2">2 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 3">3 - {basicText()}</TabPanel>
                        {Object.keys(Scheme).map((scheme, index) => (
                            <TabPanel header={`Panel (${scheme})`} scheme={schemes[index]}>{scheme} - {basicText()}</TabPanel>))}
                    </TabPane>
                    <br /><br /><br />
                    <TabPane scheme={Scheme.SUCCESS} activeIndex={1}>
                        <span>Hello WOrld</span>
                        <TabPanel header="Panel 1">1 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 2">2 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 3">3 - {basicText()}</TabPanel>

                        <div style={{ flex: 1 }} />
                        <div>
                            <TextInput placeholder='search...' />
                            <Button scheme={Scheme.DANGER} text="Proceed" style={{ marginLeft: 10 }} />
                        </div>
                    </TabPane>
                    <br /><br /><br />
                    <TabPane scheme={Scheme.PRIMARY} renderActiveTabOnly>
                        <TabPanel header="Panel 1" fill>1 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 2" fill>2 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 3" fill>3 - {basicText()}</TabPanel>
                    </TabPane>
                    <br /><br /><br />
                    <TabPane renderActiveTabOnly>
                        <TabPanel header="Panel 1" removable>1 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 2" removable removeIcon="fa fa-angle-up">2 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 3" removable removeIcon={<img style={{ width: 12, height: 12, borderRadius: 100 }} alt="aa" src="https://avatars.githubusercontent.com/u/14879387?v=4" />}>3 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 4" removable>4 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 5" removable>5 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 6" removable>6 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 7" removable>7 - {basicText()}</TabPanel>
                    </TabPane>
                    <br /><br /><br />
                    <TabPane scheme={Scheme.PRIMARY} renderActiveTabOnly>
                        <TabPanel header="Panel 1" leftIcon="fab fa-google">1 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 2" leftIcon="fa fa-square" rightIcon="fa fa-circle">2 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 3" leftIcon="fab fa-twitter" scheme={Scheme.RETRO} idleScheme={Scheme.DANGER}>3 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 4" leftIcon="fa fa-user">4 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 4" rightIcon="fa fa-search">5 - {basicText()}</TabPanel>
                    </TabPane>
                    <br /><br /><br />
                    <TabPane scheme={Scheme.WARNING} renderActiveTabOnly>
                        <TabPanel header="Panel 1">1 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 2">2 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 3">3 - {basicText()}</TabPanel>
                    </TabPane>
                    <br /><br /><br />
                    <TabPane>
                        <TabPanel header="Panel 1">1 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 2">2 - {basicText()}</TabPanel>
                        <TabPanel header="Panel 3">3 - {basicText()}</TabPanel>
                    </TabPane>
                </div>
                <div style={{ margin: 30, /*background: "grey", */padding: 20 }}>
                    <div>
                        <Button text="Expand 1" onClick={() => accordionManageRef.current?.expand([1])} />
                        <Button text="Collapse 1" onClick={() => accordionManageRef.current?.collapse([1])} />
                        <Button text="Expand All" onClick={() => accordionManageRef.current?.expandAll()} />
                        <Button text="Collapse All" onClick={() => accordionManageRef.current?.collapseAll()} />
                    </div>
                    <br />
                    <Accordion manageRef={accordionManageRef}>
                        <AccordionTab title="Header I"><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab title="Header II"><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab title="Header III"><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                    </Accordion>
                    <br /><br /><br />
                    <Accordion onTabExpand={(i: number) => console.log("Opened: ", i)}
                        onTabCollapse={(i: number) => console.log("Closed: ", i)}>
                        <AccordionTab title="One"><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab disabled><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                    </Accordion>
                    <br /><br /><br />
                    <Accordion multiple onTabChange={(opened: number[], closed: number[]) => console.log("Changed: ", opened, closed)}>
                        <AccordionTab title="One">hello</AccordionTab>
                        <AccordionTab>{basicText()}</AccordionTab>
                        <AccordionTab>{basicText()}</AccordionTab>
                    </Accordion>
                    <br /><br /><br />
                    <Accordion multiple disabled>
                        <AccordionTab borderless title="1">{basicText()}</AccordionTab>
                        <AccordionTab borderless title="2"><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab borderless title="3"><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                    </Accordion>
                    <br /><br /><br />
                    <Accordion multiple borderless>
                        <AccordionTab title="One"><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                    </Accordion>
                    <br /><br /><br />
                    <Accordion multiple activeIndexes={[0, 1, 2]}>
                        <AccordionTab title="Two">{basicText()}</AccordionTab>
                        <AccordionTab><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                    </Accordion>
                    <br /><br /><br />
                    <Accordion seperated>
                        <AccordionTab title="One"><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                    </Accordion>
                    <br /><br /><br />
                    <Accordion multiple seperated>
                        <AccordionTab title="One"><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                    </Accordion>
                    <br /><br /><br />
                    <Accordion multiple activeIndexes={[0, 1, 2]}>
                        <AccordionTab title="Two"><span>{basicText()}</span></AccordionTab>
                        <AccordionTab scheme={Scheme.SKELETON}><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab scheme={Scheme.SKELETON}><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab scheme={Scheme.SKELETON}><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                    </Accordion>
                    <br /><br /><br />
                    <Accordion multiple activeIndexes={[0, 1, 2]} scheme={Scheme.SKELETON}>
                        <AccordionTab title="Two"><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                        <AccordionTab><div style={{ margin: 10 }}>{basicText()}</div></AccordionTab>
                    </Accordion>
                    <br /><br /><br />
                    {Object.keys(Scheme).map((scheme, index) => (
                        <Accordion style={{ marginTop: 20 }} scheme={schemes[index]} outlined>
                            <AccordionTab title={`Header 1 (${scheme})`}>hello</AccordionTab>
                            <AccordionTab title={`Header 2 (${scheme})`}>{basicText()}</AccordionTab>
                            <AccordionTab title={`Header 3 (${scheme})`}>{basicText()}</AccordionTab>
                        </Accordion>))}
                </div>
                <div style={{ margin: 30, /*background: "grey", */padding: 20 }}>
                    <div>
                        <Button text="Toggle" onClick={() => panelManageRef.current?.toggle()} />
                        <Button text="Expand" onClick={() => panelManageRef.current?.expand()} />
                        <Button text="Collapse" onClick={() => panelManageRef.current?.collapse()} />
                    </div>
                    <Panel manageRef={panelManageRef} scheme={Scheme.PRIMARY} title="Hello 1" collapsible borderless attrsRelay={{ content: { transition } }}>
                        Hello World
                        <br />
                        Hello World
                        <br />
                        Hello World
                        <br />
                        Hello World
                        <br />
                        Hello World
                        <br />
                        Hello World
                        <br />
                        <Button text="Hello World" />
                    </Panel>
                    <br /><br /><br />
                    <Panel title="Hello 1" collapsible>
                        Hello World
                        <br />
                        <Button text="Hello World" />
                    </Panel>
                    <br /><br /><br />
                    <Panel collapsed footer={(options: any) => {
                        return (<div className={options.className}>Footer {options.toggleElement}</div>);
                    }}>
                        Hello World
                        <Button text="Hello World" />
                    </Panel>
                    <br /><br /><br />
                    <Panel footer={(options: any) => {
                        return (<div className={options.className}>Footer</div>);
                    }}>
                        Hello World
                        <Button text="Hello World" />
                    </Panel>
                    <br /><br /><br />
                    <Panel title="Hello 2" footer={(options: any) => {
                        return (<div className={options.className}>Footer</div>);
                    }} collapsible>
                        Hello World
                        <Button text="Hello World" />
                    </Panel>
                    <br /><br /><br />
                    <Panel scheme={Scheme.SKELETON} title="Hello 3" collapsible>
                        <div style={{ margin: 10 }}>
                            Hello WOrld
                        </div>
                        <span style={{ margin: 10 }}>Hello World</span>
                        <Button text="Hello World" style={{ margin: 10 }} />
                    </Panel>
                    <br /><br /><br />
                    {Object.keys(Scheme).map((scheme, index) => (
                        <Panel style={{ marginTop: 20 }} scheme={schemes[index]} title={`Sheme ${scheme}`} collapsible>
                            <span style={{ margin: 10 }}>Hello World {scheme}</span>
                            <br />
                            <Button style={{ margin: 10 }} text="Hello World" />
                        </Panel>))}
                </div>
                <div style={{ margin: 30, background: "grey", padding: 20 }}>
                    Transitions
                    <Dropdown fill options={Object.keys(Transition).map((alignment, index) => ({ label: alignment, value: Object.values(Transition)[index] }))}
                        onSelectOption={(option: any) => {
                            setTransition(option.value);
                            return true;
                        }} selectedOptionIndex={0} formControlProps={{ fill: true }} popoverProps={{ style: { height: 300, overflow: "auto" } }} />

                    <Button text="PopoverX" onClick={(e: any) => refs.current["popoverx"].toggle(e/*, refs.current["portaldiv1"] */)} />
                    <Popover manageRef={(e: any) => refs.current["popoverx"] = e} matchTargetSize={false} pointingArrowClassName={""}
                        style={{ backgroundColor: "white", padding: 10, "--componentMarginTopOrBottom": "0px" } as any} transition={transition} transitionTimeout={1000}
                        onShow={() => console.log("onShow")} onHide={() => console.log("onHide")}>
                        <span>Hello World pop 1</span><br />
                        <span>Hello World pop 1</span><br />
                        <span>Hello World pop 1</span><br />
                        <span>Hello World pop 1</span><br />
                        <span>Hello World pop 1</span><br />
                        <TextInput ref={onOpenRef} scheme={Scheme.PRIMARY} fill /><br />
                        <span>Hello World pop 1</span><br />
                        <span>Hello World pop 1</span><br />
                        <span>Hello World pop 1</span><br />
                    </Popover>

                    <div style={{ padding: 50, paddingTop: 320 }}>
                        <div className={transition} style={{ width: 70, height: 50, background: "red", "--transitionInfinite": "infinite" } as any}></div>
                        <br />
                        <span className={transition} style={{ display: "inline-block", "--transitionInfinite": "infinite" } as any}>Hello World</span>
                        <br /><br />
                        <Button className={transition} text="Click me" scheme={Scheme.SUCCESS} />
                        <br /><br />
                        <Button className={transition} text="Click me" style={{ "--transitionInfinite": "infinite" } as any} scheme={Scheme.SUCCESS} />
                    </div>
                </div>
                <div style={{ margin: 30, background: "grey", padding: 20 }}>
                    Toaster<br />
                    <Button text="Create Single with Toaster" onClick={() => {
                        Toaster.toast({
                            transition,
                            foreScheme: true,
                            lifetime: 100000,
                            showProgressbar: true,
                            scheme: Scheme.WARNING,
                            pauseDelayOnHover: true,
                            content: "Loading Hello World",
                            style: { background: "white" },
                            icon: MessageSpinnerIcons.NOTCH,
                        }, "toast-test-1");
                    }} />
                    <Button text="Update with Toaster" onClick={() => {
                        Toaster.update("toast-test-1", {
                            scheme: Scheme.SUCCESS,
                            content: "Hello World",
                            icon: MessageSchemesIcons.SUCCESS,
                        });
                    }} />
                    <Button text="Show Toast With Function Call" onClick={() => {
                        Toaster.toast({
                            transition,
                            foreScheme: true,
                            lifetime: 100000,
                            icon: "fa fa-circle",
                            showProgressbar: true,
                            content: "Hello World 1",
                            scheme: Scheme.SUCCESS,
                            pauseDelayOnHover: true,
                            style: { background: "white" }
                        });
                        Toaster.toast({
                            transition,
                            foreScheme: true,
                            lifetime: 100000,
                            icon: "fa fa-square",
                            showProgressbar: true,
                            content: "Hello World 2",
                            scheme: Scheme.DANGER,
                            pauseDelayOnHover: true,
                            style: { background: "white" }
                        });
                        Toaster.toast({
                            transition,
                            foreScheme: true,
                            lifetime: 100000,
                            icon: "fa fa-square",
                            showProgressbar: true,
                            content: "Hello World 3",
                            scheme: Scheme.WARNING,
                            pauseDelayOnHover: true,
                            style: { background: "white" }
                        });
                    }} />
                    <Button text="Show Multiple Toast With Function Call" onClick={() => {
                        Toaster.toast(Object.keys(Scheme).map((scheme, index) => ({
                            transition,
                            lifetime: 10000,
                            showProgressbar: true,
                            scheme: schemes[index],
                            pauseDelayOnHover: true,
                            content: "Hello " + scheme,
                            icon: (MessageSchemesIcons as any)[scheme as any] as any,
                        })));
                    }} />
                    <Button text="Clear Toast With Function Call" onClick={() => {
                        Toaster.clear();
                    }} />
                    <Button text="Destroy Toast With Function Call" onClick={() => {
                        Toaster.destroy();
                    }} />
                </div>
                <div style={{ margin: 30, background: "grey", padding: 20 }}>
                    Toast<br />
                    <Button text="Show Toast" onClick={() => {
                        toastManageRef.current?.show({
                            transition,
                            foreScheme: true,
                            lifetime: 100000,
                            showProgressbar: true,
                            scheme: Scheme.WARNING,
                            pauseDelayOnHover: true,
                            content: "Loading Hello World",
                            style: { background: "white" },
                            icon: MessageSpinnerIcons.NOTCH,
                        }, "toast-test-1");
                    }} />
                    <Button text="Remove Toast" onClick={() => {
                        toastManageRef.current?.remove("toast-test-1");
                    }} />
                    <Button text="Update Toast" onClick={() => {
                        toastManageRef.current?.update("toast-test-1", {
                            scheme: Scheme.SUCCESS,
                            content: "Hello World",
                            icon: MessageSchemesIcons.SUCCESS,
                        });
                    }} />
                    <Button text="Show Multiple Toast" onClick={() => {
                        toastManageRef.current?.show(Object.keys(Scheme).map((scheme, index) => ({
                            transition,
                            lifetime: 10000,
                            showProgressbar: true,
                            scheme: schemes[index],
                            pauseDelayOnHover: true,
                            content: "Hello " + scheme,
                            icon: (MessageSchemesIcons as any)[scheme as any] as any,
                        })));
                    }} />
                    <Button text="Reverse" onClick={() => toastManageRef.current?.reverse()} />
                    <Button text="Clear" onClick={() => toastManageRef.current?.clear()} />
                    <NumberInput onInputComplete={(value) => {
                        toastManageRef.current?.changeLimit(parseInt(value));
                    }} />
                    <Dropdown options={Object.keys(Alignment).map((alignment, index) => ({ label: alignment, value: Object.values(Alignment)[index] }))}
                        onSelectOption={(option: any) => {
                            toastManageRef.current?.changePosition(option.value);
                            return true;
                        }} selectedOptionIndex={7} formControlProps={{ fill: true }} style={{ width: 100 }} />
                    <Dropdown options={Object.keys(Orientation).map((orientation, index) => ({ label: orientation, value: Object.values(Orientation)[index] }))}
                        onSelectOption={(option: any) => {
                            toastManageRef.current?.changeOrientation(option.value);
                            return true;
                        }} selectedOptionIndex={1} formControlProps={{ fill: true }} style={{ width: 100 }} />
                    <Toast manageRef={toastManageRef} />
                </div>
                <div style={{ margin: 30, background: "grey", padding: 20 }}>
                    Messages<br />
                    <Button text="Show Message" onClick={() => {
                        messagesManageRef.current?.show({
                            transition,
                            lifetime: 10000,
                            icon: "fa fa-circle",
                            showProgressbar: true,
                            content: "Hello World",
                            scheme: Scheme.SUCCESS,
                            pauseDelayOnHover: true,
                        }, "message-test-1");
                    }} />
                    <Button text="Remove Message" onClick={() => {
                        messagesManageRef.current?.remove("message-test-1");
                    }} />
                    <Button text="Update Message" onClick={() => {
                        messagesManageRef.current?.update("message-test-1", {
                            scheme: Scheme.DANGER,
                            icon: MessageSchemesIcons.DANGER,
                        }, false);
                    }} />
                    <Button text="Show Multiple Message" onClick={() => {
                        messagesManageRef.current?.show(Object.keys(Scheme).map((scheme, index) => ({
                            transition,
                            lifetime: 1000000,
                            showProgressbar: true,
                            scheme: schemes[index],
                            pauseDelayOnHover: true,
                            content: "Hello " + scheme,
                            icon: (MessageSchemesIcons as any)[scheme as any] as any,
                        })));
                    }} />
                    <Button text="Reverse" onClick={() => messagesManageRef.current?.reverse()} />
                    <Button text="Clear" onClick={() => messagesManageRef.current?.clear()} />
                    <NumberInput onInputComplete={(value) => {
                        messagesManageRef.current?.changeLimit(parseInt(value));
                    }} />
                    <Dropdown options={Object.keys(Alignment).map((alignment, index) => ({ label: alignment, value: Object.values(Alignment)[index] }))}
                        onSelectOption={(option: any) => {
                            messagesManageRef.current?.changePosition(option.value);
                            return true;
                        }} selectedOptionIndex={7} formControlProps={{ fill: true }} style={{ width: 100 }} />
                    <Dropdown options={Object.keys(Orientation).map((orientation, index) => ({ label: orientation, value: Object.values(Orientation)[index] }))}
                        onSelectOption={(option: any) => {
                            messagesManageRef.current?.changeOrientation(option.value);
                            return true;
                        }} selectedOptionIndex={1} formControlProps={{ fill: true }} style={{ width: 100 }} />
                    <Messages manageRef={messagesManageRef} style={{ overflow: "auto", marginTop: 20, width: "100%", height: 500, background: "white" }} onAction={(_: any, key: any) => {
                        console.log("THE KEY ACTIONS", key);
                    }} onRemove={(_: any, key: any) => {
                        console.log("THE KEY REMOVED", key);
                    }} />
                </div>
                <div style={{ margin: 30, background: "grey", padding: 20 }}>
                    <Message style={{ background: "white" }} lifetime={1000000} content="Hello World" icon="fa fa-circle" showProgressbar pauseDelayOnHover />
                    <br />
                    <Message showProgressbar lifetime={1000000} closeOnClick style={{ background: "green", color: "white" }} sticky content={<div>
                        Hello this is a custom content
                        <br /><br />
                        <i className='fa fa-user' style={{ marginRight: 10 }} />
                        <TextInput scheme={Scheme.PRIMARY} />
                    </div>} />
                    <br />
                    {Object.keys(Scheme).map((scheme, index) => (
                        <div style={{ marginBottom: 20, display: "flex" }}>
                            <Message showProgressbar key={index} scheme={schemes[index]} content={`Scheme ${scheme}`}
                                icon={(MessageSchemesIcons as any)[scheme as any] as any} lifetime={20000} pauseDelayOnHover />
                            <Message style={{ marginLeft: 20, background: "white" }} showProgressbar key={"" + index + "-"} scheme={schemes[index]} content={`Scheme ${scheme}`}
                                icon={(MessageSchemesIcons as any)[scheme as any] as any} foreScheme />
                        </div>
                    ))}
                </div>
                <div style={{ margin: 30 }}>
                    <br /><br />
                    <ProgressBar value={60} percentageColors={{
                        0: {
                            fg: "blue"
                        },
                        5: {
                            fg: "red"
                        },
                        10: {
                            bg: "brown",
                            fg: "yellow",
                        },
                        49: {
                            bg: "gold",
                        },
                        60: {
                            bg: "white",
                            fg: "black",
                        },
                    }} />
                    <br /><br />
                </div>
                <div style={{ margin: 30 }}>
                    <br /><br />
                    <DateTimeInput leftContent="fa fa-calendar" placeholder="Select multiple date" />
                    <br /><br />
                    <YearInput scheme={Scheme.INFO} placeholder="Select year" selectionMode={DateTimePickerSelectionMode.SINGLE} />
                    <br /><br />
                    <MonthInput scheme={Scheme.INFO} placeholder="Select month" selectionMode={DateTimePickerSelectionMode.SINGLE} />
                    <br /><br />
                    <TimeInput scheme={Scheme.INFO} placeholder="Select time 12 hours" selectionMode={DateTimePickerSelectionMode.SINGLE} />
                    <br /><br />
                    <TimeInput hourFormat="24" scheme={Scheme.WARNING} placeholder="Select time 24 hours" selectionMode={DateTimePickerSelectionMode.SINGLE} />
                    <br /><br />
                    <DateInput value={new Date()} borderless scheme={Scheme.INFO} placeholder="Select single date" selectionMode={DateTimePickerSelectionMode.SINGLE} />
                    <br /><br />
                    <DateTimeInput editable scheme={Scheme.PRIMARY} placeholder="Select date range" selectionMode={DateTimePickerSelectionMode.RANGE} />
                    <br /><br />
                    <DateTimeInput highlightToday value={[new Date(), new Date(), new Date()]} scheme={Scheme.DANGER} onSelectDate={(e: any) => console.log(e)} placeholder="Select multiple date" selectionMode={DateTimePickerSelectionMode.MULTIPLE} />
                    <br /><br />
                    <br /><br />
                    <Button text="Modal TimePicker" onClick={(e: any) => refs.current["modal-date3"].toggle(e)} />
                    <TimePicker type={DateTimePickerType.MODAL} manageRef={(e: any) => refs.current["modal-date3"] = e} />
                    <br /><br />
                    <Button text="Modal YearPicker" onClick={(e: any) => refs.current["modal-year1"].toggle(e)} />
                    <YearPicker type={DateTimePickerType.MODAL} manageRef={(e: any) => refs.current["modal-year1"] = e} />
                    <br /><br />
                    <Button text="Modal MonthPicker" onClick={(e: any) => refs.current["modal-month1"].toggle(e)} />
                    <MonthPicker type={DateTimePickerType.MODAL} manageRef={(e: any) => refs.current["modal-month1"] = e} />
                    <br /><br />
                    <Button text="Modal DatePicker" onClick={(e: any) => refs.current["modal-date2"].toggle(e)} />
                    <DatePicker type={DateTimePickerType.MODAL} manageRef={(e: any) => refs.current["modal-date2"] = e} />
                    <br /><br />
                    <Button text="Modal DateTimePicker" onClick={(e: any) => refs.current["modal-date1"].toggle(e)} />
                    <DateTimePicker type={DateTimePickerType.MODAL} showTime manageRef={(e: any) => refs.current["modal-date1"] = e} />
                    <br /><br />
                    <br /><br />
                    <Button text="Popover TimePicker" onClick={(e: any) => refs.current["popover-date3"].toggle(e)} />
                    <TimePicker type={DateTimePickerType.POPOVER} manageRef={(e: any) => refs.current["popover-date3"] = e} />
                    <br /><br />
                    <Button text="Popover Year" onClick={(e: any) => refs.current["popover-year1"].toggle(e)} />
                    <YearPicker type={DateTimePickerType.POPOVER} manageRef={(e: any) => refs.current["popover-year1"] = e} />
                    <br /><br />
                    <Button text="Popover Month" onClick={(e: any) => refs.current["popover-month1"].toggle(e)} />
                    <MonthPicker type={DateTimePickerType.POPOVER} manageRef={(e: any) => refs.current["popover-month1"] = e} />
                    <br /><br />
                    <Button text="Popover DatePicker" onClick={(e: any) => refs.current["popover-date2"].toggle(e)} />
                    <DatePicker type={DateTimePickerType.POPOVER} manageRef={(e: any) => refs.current["popover-date2"] = e} />
                    <br /><br />
                    <Button text="Popover DateTimePicker" onClick={(e: any) => refs.current["popover-date1"].toggle(e)} />
                    <DateTimePicker type={DateTimePickerType.POPOVER} showTime manageRef={(e: any) => refs.current["popover-date1"] = e} />
                    <br /><br />
                    <Button text="Popover ISW DateTimePicker" onClick={(e: any) => refs.current["popover-isw-date"].toggle(e)} />
                    <DateTimePicker type={DateTimePickerType.POPOVER} className='isw-dp' disableToDate={new Date(2023, 10, 14)} manageRef={(e: any) => refs.current["popover-isw-date"] = e} footerLayout='' dontOverlapDate />
                    <br /><br />
                    <br /><br />
                    <DateTimePicker scheme={Scheme.DANGER} mode={DateTimePickerMode.MONTH} />
                    <br /><br />
                    <DateTimePicker staticMode scheme={Scheme.DANGER} mode={DateTimePickerMode.MONTH} />
                    <br /><br />
                    <DateTimePicker scheme={Scheme.PRIMARY} mode={DateTimePickerMode.YEAR} />
                    <br /><br />
                    <DateTimePicker staticMode />
                    <br /><br />
                    <br /><br />
                    <DateTimePicker className='dp1' footerLayout='' highlightDatesInRange selectionMode={DateTimePickerSelectionMode.RANGE} bottomLayout='<> ClearElement SelectElement'
                        onSelectDate={(e) => console.log("----", e)} labelsMap={{ SelectElement: "Apply" }} leftLayout={DateTimePickerLayout.FINE_LEFT_LAYOUT} />
                    <br /><br />
                    <DateTimePicker className='isw-dp' disableToDate={new Date(2023, 10, 14)} footerLayout='' dontOverlapDate />
                    <br /><br />
                    <DateTimePicker showTime />
                    <br /><br />
                    <DateTimePicker />
                    <br /><br />
                    <DateTimePicker footerLayout='' />
                    <br /><br />
                    <br /><br />
                    <TimePicker timeLayout={`{ ${DateTimePickerLayoutElement.PreviousElement} ${DateTimePickerLayoutElement.HourElement} ${DateTimePickerLayoutElement.NextElement} }`} />
                    <TimePicker timeLayout={`{ ${DateTimePickerLayoutElement.PreviousElement} ${DateTimePickerLayoutElement.MinutesElement} ${DateTimePickerLayoutElement.NextElement} }`} />
                    <br /><br />
                    <TimePicker timeLayout={`< IncrementElement MinutesElement DecrementElement > TimeSeperator < IncrementElement SecondsElement DecrementElement >`} />
                    <br /><br />
                    <TimePicker />
                    <br /><br />
                    <TimePicker hourFormat={"24"} timeLayout={DateTimePickerLayout.TIME_LAYOUT_WITHOUT_MERIDIAN} />
                    <br /><br />
                    <br /><br />
                    <DatePicker
                        footerLayout=''
                        bottomLayout={DateTimePickerLayout.DEFAULT_FOOTER_LAYOUT}
                        scheme={Scheme.SUCCESS} showTime leftLayout={DateTimePickerLayout.FINE_LEFT_LAYOUT}
                        selectionMode={DateTimePickerSelectionMode.RANGE} highlightDatesInRange
                        onSelectDate={(options) => console.log(":::::::", options)}
                        customElementTemplate={(options) => {
                            console.log("custom element", options.layoutElement);
                            return (<div style={{ width: "auto", display: "flex" }}><TextInput fill />
                                <Button scheme={Scheme.INFO} text="Search" onClick={options.controlActionMap["TodayDateElement"]} /></div>);
                        }}
                    />
                    <br /><br />
                    <DateTimePicker leftLayout="SelectedDatesElements"
                        selectedDates={[new Date(2023, 9, 29), new Date(2023, 10, 4), new Date(2023, 10, 13)]}
                        onMaxMultipleDateSelected={() => console.log("MAX MULTIPLE DATES SELECTED")} highlightToday
                        reportOnSelectClickOnly={true} onSelectDate={(options) => console.log(":::::::", options, options.formatDate(options.selectedDate!))}
                        selectionMode={DateTimePickerSelectionMode.MULTIPLE} disabledYears={[2024, 2022]}
                        enabledYears={[2025]} disabledWeekdays={[Weekday.SUNDAY]}
                        enabledWeekdays={[Weekday.MONDAY]}
                        disabledMonths={[Month.OCTOBER]}
                        enabledMonths={[Month.DECEMBER]} makeOverlapSelectable
                        enabledDates={[new Date(2023, 10, 12)]} highlightDatesInRange={true}
                        disabledDates={[new Date(2023, 10, 24), new Date(2023, 10, 27), new Date(2023, 10, 29)]}
                        disableFromDate={new Date(2023, 10, 11)}
                        disableToDate={new Date(2023, 10, 16)} locale='en'
                        showDatesSeperator scheme={Scheme.PRIMARY} maxMultipleModeDateSelection={5} />
                </div>
                <div style={{ margin: 30 }}>
                    <br />
                    <FileInput mode={FileInputMode.CONTROLLED} defaultFiles={[
                        new File(["We are here"], "we.txt", { type: 'text/plain' }),
                        new File(["Hello World"], "hello.txt", { type: 'text/plain' }),
                    ]} />
                    <br />
                    <div ref={chatSenderRef} style={{ background: "lightgray", padding: 20 }}>
                        <FileInput noDragAndDrop dragAndDropRefs={[chatSenderRef]} orientation={Orientation.HORIZONTAL} mode={FileInputMode.PREVIEW} manageRef={fileInpuManagetRef} emptyTemplate={() => null} />
                        <TextAreaInput /><Button text="Clear" onClick={() => fileInpuManagetRef.current?.clear()} /><Button text="Upload" onClick={() => fileInpuManagetRef.current?.select()} />
                    </div>
                </div>
                <div style={{ margin: 30 }}>
                    <FileInput multiple noDragAndDrop mode={FileInputMode.CONTROLLED} onAction={(f) => console.log("::::", f)}
                        selectControl={{ rounded: true, outlined: true, leftIcon: "fa fa-image", scheme: Scheme.INFO, text: null, fillOnHover: true }}
                        actionControl={{ rounded: true, outlined: true, leftIcon: "fa fa-cloud", scheme: Scheme.SUCCESS, text: null, fillOnHover: true }}
                        clearControl={{ rounded: true, outlined: true, leftIcon: "fa fa-times", scheme: Scheme.DANGER, text: null, fillOnHover: true, style: { padding: "10px 12px" } }}
                        emptyTemplate={(_: any, onDrop: any, onDragOver: any) => (<div onDrop={onDrop} onDragOver={onDragOver} style={{ color: "#dee2e6", padding: 100, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <i className='fa fa-image' style={{ fontSize: 60, marginBottom: 15 }} />
                            <span style={{ color: "#6c757d" }}>Drag and Drop Image Here</span>
                        </div>)} />
                    <br />
                    <FileInput mode={FileInputMode.CONTROLLED} scheme={Scheme.SUCCESS} onAction={(f) => console.log("::::", f)} multiple />
                    <br />
                    <FileInput mode={FileInputMode.ELEMENT} id="i1" name='i1' onCancelDialog={(e) => console.log("Cancel", e)}
                        onConfirmDialog={(e) => console.log("Confirm", e)} onSelectFiles={(files) => console.log("SELECTED FILES", files)} />
                    <br /><br />
                    <FileInput mode={FileInputMode.BUTTON} buttonProps={{
                        leftIcon: "fa fa-user",
                        text: "Upload your images",
                    }} onSelectFiles={(files) => console.log("SELECTED FILES 2", files[0].type)} scheme={Scheme.INFO} multiple />
                    <br />
                    <FileInput clickToChange rounded mode={FileInputMode.PREVIEW} scheme={Scheme.SUCCESS} orientation={Orientation.HORIZONTAL} multiple />
                    <br />
                    <FileInput label="Select" mode={FileInputMode.PREVIEW} scheme={Scheme.SUCCESS} orientation={Orientation.HORIZONTAL} multiple />
                    <br />
                    <FileInput stickyPreview rounded label={<i className='fa fa-pen' />} attrsRelay={{ label: { style: { borderRadius: "50%" }, alignment: Alignment.BOTTOM_RIGHT } }} mode={FileInputMode.PREVIEW} scheme={Scheme.SUCCESS} orientation={Orientation.HORIZONTAL} />
                    <br />
                    <FileInput mode={FileInputMode.PREVIEW} scheme={Scheme.PRIMARY} orientation={Orientation.HORIZONTAL} maxFileSize={2000000}
                        itemTemplate={(options) => (<div key={options.index} style={{ position: "relative", width: 200, height: 200 }}>
                            {options.previewElement}
                            <div style={{ bottom: 0, fontSize: 12, position: "absolute", background: "rgba(217,217,217,0.5)", padding: 5, display: "flex", flexDirection: "column" }}>
                                <span>{options.file.name}</span>
                                <span>{options.formattedSize} - {options.file.type}</span>
                            </div>
                        </div>)} emptyTemplate={(onSelect?: (e: any) => void) => (<div onClick={onSelect}
                            style={{ width: 600, height: 300, cursor: "pointer", border: "1px dashed #3699ff", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <i className='fa fa-upload' style={{ fontSize: 20, margin: 20 }} />
                            <b>Select file or drag and drop here</b>
                            <span>CSV file no more than 2MB</span>
                            <br />
                            <Button text="SELECT FILE" scheme={Scheme.PRIMARY} outlined />
                        </div>)} onValidationFail={(_, error) => {
                            console.log("FAILED VALIDATION", error);
                            return true;
                        }} onSelectFiles={(files) => console.log("SELECTED FILES 3", files)} selectOnly multiple />
                </div>
                <div style={{ margin: 30 }}>
                    <TextAreaInput style={{}} rows={5} autoGrowHeight manageRef={inputManageRef} />
                    <Button text="clear" onClick={() => console.log(inputManageRef.current?.clear())} />
                </div>
                <div style={{ margin: 30 }}>
                    <List paginate scheme={Scheme.SECONDARY} stripedRows={false} showGridlines={false} dataKey="name"
                        header={() => (<div style={{ fontWeight: "bold", margin: 0, background: "#f8f9fa" }}>
                            <FormControl rightContent={"fa fa-search"} style={{ width: "100%" }}>
                                <TextInput fill />
                            </FormControl>
                        </div>)} rowsPerPage={5} totalRecords={300}
                        paginatorTemplate={{ layout: "PreviousPageElement PageElements NextPageElement" }}
                        data={dynamicDataTable.map((o, i) => ({ name: "Platform " + (i + o + 1), service_code: "svc_" + (i + o + 1), logo: "fa fa-" + Math.min(9, i + o + 1), }))}
                        onPageChange={(e: PaginatorPageChangeOption) => {
                            setDynamicDataTable(Array(5).fill((e.currentPage - 1) * 5));
                        }} style={{ width: "fit-content" }} />
                    <List paginate scheme={Scheme.PRIMARY} stripedRows showGridlines={true} template={(d) => (<div><i className={d.logo} /> {d.name}</div>)}
                        header={() => (<div style={{ fontWeight: "bold", margin: 0, background: "#f8f9fa" }}>
                            <FormControl rightContent={"fa fa-search"} style={{ width: "100%" }}>
                                <TextInput fill />
                            </FormControl>
                        </div>)} style={{ marginTop: 20 }} rowsPerPage={5}
                        paginatorTemplate={{ layout: "PreviousPageElement PageElements NextPageElement" }} footer={() => "The foooter"}
                        data={Array(30).fill(null).map((_, i) => ({ name: "Platform " + (i + 1), service_code: "svc_" + (i + 1), logo: "fa fa-" + Math.min(9, i + 1), }))} />
                    <List paginate scheme={Scheme.DANGER} data={tableData} stripedRows showGridlines={false}
                        style={{ marginTop: 20 }} noDivider template={(d) => (<div><i className={d.logo} /> {d.name}</div>)}
                        paginatorTemplate={{ layout: "PreviousPageElement PageElements NextPageElement" }} />
                    <List data={[]} stripedRows showGridlines={true} style={{ marginTop: 20 }} template={(d) => (<div><i className={d.logo} /> {d.name}</div>)}
                        emptyState={(<div>No data</div>)} />
                </div>
                <div style={{ margin: 30 }}>
                    <div id="con2" style={{ marginTop: 30, height: 200, width: 200, overflow: "auto" }}>
                        <div style={{ background: "yellow", height: 500 }}></div>
                        <ViewportSensor ref={(r) => refs.current["vpsensor"] = r} id="vs2" style={{ width: "100%", background: "red", height: 40 }} onEnterViewport={() => {
                            console.log("Enter view port");
                            return true;
                        }} onExitViewport={() => {
                            console.log("Exit view port");
                            return false;
                        }}>
                            <Button text="Loading" leftIcon="fa fa-spinner fa-spin" />
                        </ViewportSensor>
                    </div>
                    <div id="con" style={{ marginTop: 30, height: 200, width: 200, overflow: "auto", display: "flex" }}>
                        <div style={{ background: "yellow", minWidth: 1000, height: 200 }}></div>
                        <ViewportSensor id="vs" style={{ minWidth: 40, background: "red", height: 200 }} onEnterViewport={() => {
                            console.log("Enter1 view port");
                            return true;
                        }} onExitViewport={() => {
                            console.log("Exit1 view port");
                            return true;
                        }} />
                        <div style={{ background: "yellow", minWidth: 1000, height: 200 }}></div>
                    </div>
                    <div id="con2" style={{ marginTop: 30, height: 200, width: 200, overflow: "auto" }}>
                        <div style={{ background: "yellow", height: 1000 }}></div>
                        <ViewportSensor id="vs2" style={{ width: "100%", background: "red", height: 40 }} onEnterViewport={() => {
                            console.log("Enter view port");
                            return true;
                        }} onExitViewport={() => {
                            console.log("Exit view port");
                            return true;
                        }} />
                        <div style={{ background: "yellow", height: 1000 }}></div>
                    </div>
                </div>
                <div style={{ margin: 30 }}>
                    <TextAreaInput style={{}} rows={5} autoGrowHeight />
                    <Dropdown editable options={[
                        {
                            user: {
                                profile: {
                                    data: {
                                        logo: "https://cdn.countryflags.com/thumbs/nigeria/flag-3d-round-250.png"
                                    }
                                },
                                u: "You"
                            },
                            name: "Nigeria"
                        },
                        {
                            user: {
                                profile: {
                                    data: {
                                        logo: "https://cdn.countryflags.com/thumbs/uganda/flag-3d-round-250.png"
                                    }
                                },
                                u: "Me"
                            },
                            name: "Uganda"
                        }
                    ]} optionMap={{
                        value: "{name}",
                        label: "{user.u}",
                        icon: "{user.profile.data.logo}"
                    }}
                        selectedOptionIndex={1}
                        cleareable formControlProps={{ leftContent: (<i className="fa fa-search" style={{ marginLeft: 10 }} />), style: { background: "rgba(217, 217, 217, 0.2)" } }}
                        borderless style={{ width: 400 }} placeholder="Hello" scheme={Scheme.PRIMARY} renderOptionAsPlaceholder onInputComplete={(v: string) => console.log("DONE", v)} />

                    <br />
                    <Dropdown editable togglePosition={Position.LEFT} options={[
                        {
                            user: {
                                profile: {
                                    data: {
                                        logo: "https://cdn.countryflags.com/thumbs/nigeria/flag-3d-round-250.png"
                                    }
                                },
                                u: "You"
                            },
                            name: "Nigeria"
                        },
                        {
                            user: {
                                profile: {
                                    data: {
                                        logo: "https://cdn.countryflags.com/thumbs/uganda/flag-3d-round-250.png"
                                    }
                                },
                                u: "Me"
                            },
                            name: "Uganda"
                        }
                    ]} optionMap={{
                        value: "{name}",
                        label: "{user.u}",
                        icon: "{user.profile.data.logo}"
                    }}
                        selectedOptionIndex={1}
                        cleareable formControlProps={{ leftContent: (<i className="fa fa-search" style={{ marginLeft: 10 }} />), style: { background: "rgba(217, 217, 217, 0.2)" } }}
                        borderless style={{ width: 400 }} placeholder="Hello" scheme={Scheme.PRIMARY} renderOptionAsPlaceholder onInputComplete={(v: string) => console.log("DONE", v)} />

                    <br />
                    <Dropdown editable togglePosition={Position.LEFT} iconPosition={Position.RIGHT} options={[
                        {
                            user: {
                                profile: {
                                    data: {
                                        logo: "https://cdn.countryflags.com/thumbs/nigeria/flag-3d-round-250.png"
                                    }
                                },
                                u: "You"
                            },
                            name: "Nigeria"
                        },
                        {
                            user: {
                                profile: {
                                    data: {
                                        logo: "https://cdn.countryflags.com/thumbs/uganda/flag-3d-round-250.png"
                                    }
                                },
                                u: "Me"
                            },
                            name: "Uganda"
                        }
                    ]} optionMap={{
                        value: "{name}",
                        label: "{user.u}",
                        icon: "{user.profile.data.logo}"
                    }}
                        selectedOptionIndex={1}
                        cleareable formControlProps={{ style: { background: "rgba(217, 217, 217, 0.2)" } }}
                        borderless style={{ width: 400 }} placeholder="Hello" scheme={Scheme.PRIMARY} renderOptionAsPlaceholder onInputComplete={(v: string) => console.log("DONE", v)} />

                    <br />
                    <Dropdown editable togglePosition={Position.RIGHT} iconPosition={Position.RIGHT} options={[
                        {
                            user: {
                                profile: {
                                    data: {
                                        logo: "https://cdn.countryflags.com/thumbs/nigeria/flag-3d-round-250.png"
                                    }
                                },
                                u: "You"
                            },
                            name: "Nigeria"
                        },
                        {
                            user: {
                                profile: {
                                    data: {
                                        logo: "https://cdn.countryflags.com/thumbs/uganda/flag-3d-round-250.png"
                                    }
                                },
                                u: "Me"
                            },
                            name: "Uganda"
                        }
                    ]} optionMap={{
                        value: "{name}",
                        label: "{user.u}",
                        icon: "{user.profile.data.logo}"
                    }}
                        selectedOptionIndex={1}
                        cleareable formControlProps={{ style: { background: "rgba(217, 217, 217, 0.2)" } }}
                        borderless style={{ width: 400 }} placeholder="Hello" scheme={Scheme.PRIMARY} renderOptionAsPlaceholder onInputComplete={(v: string) => console.log("DONE", v)} />

                    <br />
                    <Dropdown editable togglePosition={Position.LEFT} iconPosition={Position.RIGHT} options={[
                        {
                            user: {
                                profile: {
                                    data: {
                                        logo: "https://cdn.countryflags.com/thumbs/nigeria/flag-3d-round-250.png"
                                    }
                                },
                                u: "You"
                            },
                            name: "Nigeria"
                        },
                        {
                            user: {
                                profile: {
                                    data: {
                                        logo: "https://cdn.countryflags.com/thumbs/uganda/flag-3d-round-250.png"
                                    }
                                },
                                u: "Me"
                            },
                            name: "Uganda"
                        }
                    ]} optionMap={{
                        value: "{name}",
                        label: "{user.u}",
                        icon: "{user.profile.data.logo}"
                    }}
                        selectedOptionIndex={1}
                        formControlProps={{ style: { background: "rgba(217, 217, 217, 0.2)" } }}
                        borderless style={{ width: 400 }} placeholder="Hello" scheme={Scheme.PRIMARY} onInputComplete={(v: string) => console.log("DONE", v)} />
                </div>
                <div style={{ margin: 30 }}>
                    <Button text={"Show Alert Dialog Func"} onClick={() => alertDialog({
                        message: "Hello World",
                        transition,
                    }).show()} />
                    <Button text={"Show Alert Popover Func"} onClick={() => alertPopover({
                        message: "Hello World"
                    }).show()} />
                    <Button text={"Show Alert Loading"} onClick={() => loadingD.show()} />
                    <Button text={"Show Alert Dialog"} onClick={() => setShowAlertDialog(!showAlertDialog)} />
                    <AlertDialog icon="fa fa-circle" transitionTimeout={500} visible={showAlertDialog} onHide={() => setShowAlertDialog(!showAlertDialog)} message={
                        (<p>
                            Are you sure you want to delete the email <br />
                            <b>address@domain.com</b> from this account. <br />
                            You can always add another email.
                        </p>)
                    } alignFooter={Alignment.CENTER} alignment={Alignment.TOP} />

                    <Button text={"Show Alert Popover"} onClick={() => setShowAlertPopover(!showAlertPopover)} />
                    <AlertPopover visible={showAlertPopover} onHide={() => setShowAlertPopover(!showAlertPopover)} message={
                        (<p>
                            Are you sure you want to delete the email <br />
                            <b>address@domain.com</b> from this account. <br />
                            You can always add another email.
                        </p>)
                    } alignFooter={Alignment.CENTER} alignment={Alignment.TOP} />
                </div>
                <div style={{ margin: 30 }}>
                    <FormControl scheme={Scheme.PRIMARY} leftContent="fa fa-user">
                        <TextInput />
                    </FormControl>
                    <ComposedPassword scheme={Scheme.PRIMARY} formControlProps={{ leftContent: "fa fa-user", invalid: !inputIsValid }}
                        inputProps={{ onFirstInput: () => setInputIsValid(true), onInputEmpty: () => setInputIsValid(false) }} />
                    <br />
                    <ComposedPassword scheme={Scheme.SUCCESS} toggleIcons={{
                        show: (<span>Show</span>),
                        hide: (<span>Hide</span>),
                    }} onShow={() => console.log("onShow")} onHide={() => console.log("onHide")} />
                    <br />
                    <ComposedPassword scheme={Scheme.INFO} strengthIndicator progressProps={{ value: 34 }} inputProps={{ readOnly: true }}
                        formControlProps={{ invalid: true }} />
                    <br />
                    <ComposedPassword scheme={Scheme.PRIMARY} formControlProps={{ borderless: true }} />
                    <br />
                    <ComposedPassword />
                </div>
                <div style={{ margin: 30 }}>
                    <Dropdown options={Object.keys(chartyMap).map((value) => ({ label: value, value }))}
                        onSelectOption={(option: any) => {
                            setCharty(option.value);
                            return true;
                        }} selectedOptionIndex={0} formControlProps={{ fill: true }} />
                    <br />
                    <Chart style={{ width: 700 }} type={charty} data={chartyMap[charty].data} options={chartyMap[charty].options} />
                </div>
                <div style={{ margin: 30 }}>
                    <Table paginate scheme={Scheme.SECONDARY} stripedRows={false} showGridlines={false} hideHeaders={false}
                        header={() => (<div style={{ fontWeight: "bold", margin: 0, background: "#f8f9fa" }}>
                            <FormControl rightContent={"fa fa-search"} style={{ width: "100%" }}>
                                <TextInput fill />
                            </FormControl>
                        </div>)} rowsPerPage={5} totalRecords={300}
                        paginatorTemplate={{ layout: "PreviousPageElement PageElements NextPageElement" }}
                        data={dynamicDataTable.map((o, i) => ({ name: "Platform " + (i + o + 1), service_code: "svc_" + (i + o + 1), logo: "fa fa-" + Math.min(9, i + o + 1), }))}
                        onPageChange={(e: PaginatorPageChangeOption) => {
                            setDynamicDataTable(Array(5).fill((e.currentPage - 1) * 5));
                        }}>
                        <Column sortable style={{ width: '25%' }} header={() => "Icon"} template={(v: any) => <i className={v.logo} />} />
                        <Column sortable style={{ width: '25%' }} header="Name" dataKey="{name} -> {service_code}" />
                        <Column sortable style={{ width: '25%' }} header="Service Code" dataKey="service_code" canUnsort />
                    </Table>
                    <Table valuedRowProps={(data: any) => {
                        if (data.service_code === "svc_2") {
                            console.log("-------", data);
                            return {
                                style: {
                                    borderLeft: "2px solid red"
                                }
                            };
                        }
                        return {};
                    }} paginate scheme={Scheme.PRIMARY} stripedRows showGridlines={true} hideHeaders={false}
                        header={() => (<div style={{ fontWeight: "bold", margin: 0, background: "#f8f9fa" }}>
                            <FormControl rightContent={"fa fa-search"} style={{ width: "100%" }}>
                                <TextInput fill />
                            </FormControl>
                        </div>)} internalElementProps={{ style: { borderCollapse: "collapse" } }} style={{ marginTop: 20 }} rowsPerPage={5}
                        paginatorTemplate={{ layout: "PreviousPageElement PageElements NextPageElement" }} footer={() => "The foooter"}
                        data={Array(30).fill(null).map((_, i) => ({ name: "Platform " + (i + 1), service_code: "svc_" + (i + 1), logo: "fa fa-" + Math.min(9, i + 1), }))}>
                        <Column template={(logo: any) => <i className={logo} />} dataKey="logo" />
                        <Column header="Namer" dataKey="name" />
                        <Column header="Service Code" dataKey="service_code" />
                    </Table>
                    <Table paginate scheme={Scheme.DANGER} data={tableData} stripedRows showGridlines={false} hideHeaders={false}
                        sortMode={SortMode.MULTIPLE} style={{ marginTop: 20 }} noDivider
                        paginatorTemplate={{ layout: "PreviousPageElement PageElements NextPageElement" }}>
                        <Column template={(logo: any) => <i className={logo} />} dataKey="logo" />
                        <Column canUnsort sortable header="Name Here" dataKey="name" valuedProps={{
                            "Admin": {
                                style: { color: "red", }
                            },
                            "Rideon": {
                                style: { borderLeft: "2px solid green", }
                            }
                        }} />
                        <Column canUnsort sortable header="Service Code" dataKey="service_code" />
                    </Table>
                    <Table data={[]} stripedRows showGridlines={true} hideHeaders={false} style={{ marginTop: 20 }}
                        emptyState={(<div>No data</div>)}>
                        <Column template={(logo: any) => <i className={logo} />} dataKey="logo" />
                        <Column header="Name" dataKey="name" />
                        <Column header="Service Code" dataKey="service_code" />
                    </Table>
                </div>
                <div style={{ margin: 30 }}>
                    <Button text="Show Alert Dialog" leftIcon="fa fa-check" scheme={Scheme.DARK} onClick={() => alert(!showDialog)} />
                </div>
                <div style={{ margin: 30 }}>
                    <Dropdown options={Object.keys(Alignment).map((alignment, index) => ({ label: alignment, value: Object.values(Alignment)[index] }))}
                        onSelectOption={(option: any) => {
                            setDialogAlignment(option.value || Alignment.CENTER);
                            return true;
                        }} />
                    <br />
                    <Button text="Show Basic" leftIcon="fa fa-clone fa-flip-vertical" scheme={Scheme.PRIMARY} onClick={() => setShowDialog(!showDialog)} />
                    <Button text="Show Basic" leftIcon="fa fa-clone fa-flip-vertical" scheme={Scheme.SUCCESS} onClick={() => setShowRivtnDialog(!showRivtnDialog)} />

                    <Dialog transition={transition} visible={showRivtnDialog} style={{ maxWidth: 400 }} onHide={() => setShowRivtnDialog(false)} alignment={dialogAlignment} notClosable>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span>Request New 2fa Authenticator</span>
                            <p>A new 2fa QR code and plain text has been sent to your email address.</p>
                            <svg width="168" height="168" viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: 30, marginBottom: 40 }}>
                                <path d="M72.3337 99L54.417 81.0833C52.8892 79.5556 50.9448 78.7917 48.5837 78.7917C46.2225 78.7917 44.2781 79.5556 42.7503 81.0833C41.2225 82.6111 40.4587 84.5556 40.4587 86.9167C40.4587 89.2778 41.2225 91.2222 42.7503 92.75L66.5003 116.5C68.167 118.167 70.1114 119 72.3337 119C74.5559 119 76.5003 118.167 78.167 116.5L125.25 69.4167C126.778 67.8889 127.542 65.9445 127.542 63.5833C127.542 61.2222 126.778 59.2778 125.25 57.75C123.723 56.2222 121.778 55.4583 119.417 55.4583C117.056 55.4583 115.111 56.2222 113.584 57.75L72.3337 99ZM84.0003 167.333C72.4725 167.333 61.6392 165.144 51.5003 160.767C41.3614 156.389 32.542 150.453 25.042 142.958C17.542 135.458 11.6059 126.639 7.23366 116.5C2.86144 106.361 0.672548 95.5278 0.666992 84C0.666992 72.4722 2.85588 61.6389 7.23366 51.5C11.6114 41.3611 17.5475 32.5417 25.042 25.0417C32.542 17.5417 41.3614 11.6056 51.5003 7.23334C61.6392 2.86112 72.4725 0.672227 84.0003 0.666672C95.5281 0.666672 106.361 2.85556 116.5 7.23334C126.639 11.6111 135.459 17.5472 142.959 25.0417C150.459 32.5417 156.398 41.3611 160.775 51.5C165.153 61.6389 167.339 72.4722 167.334 84C167.334 95.5278 165.145 106.361 160.767 116.5C156.389 126.639 150.453 135.458 142.959 142.958C135.459 150.458 126.639 156.397 116.5 160.775C106.361 165.153 95.5281 167.339 84.0003 167.333Z" fill="#0FA883" />
                            </svg>
                            <Button text="Close" scheme={Scheme.SUCCESS} onClick={() => setShowRivtnDialog(false)} fill />
                        </div>
                    </Dialog>
                    <Dialog transition={transition} visible={showDialog} disableScroll={true} alignment={dialogAlignment} notClosable={false}
                        icons={["One", "two",]} header={<i className='fa fa-user' />} noOverlay={false} modalProps={{ style: { background: "rgba(35, 97, 204, 0.4)" } }}
                        closeIcon={<span>Close</span>} dismissableModal={false} container={refs.current["dialogDiv1"]}
                        contentProps={{ style: { background: "red" } }} headerProps={{ style: { background: "green", borderBottom: "none" } }}
                        footer={<div style={{ background: "yellow", borderTop: "none" }}>
                            <Button text="Cancel" leftIcon="fa fa-times" textOnly scheme={Scheme.DANGER} onClick={() => setShowDialog(false)} />
                            <Button text="Continue" leftIcon="fa fa-check" scheme={Scheme.PRIMARY} onClick={() => setShowDialog(false)} style={{ marginLeft: 20 }} />
                        </div>} onOpenFocusRef={onOpenRef} onCloseFocusRef={onCloseRef} maximizeIcons={{
                            maximize: "fa fa-plus",
                            minimize: "fa fa-minus",
                        }} onHide={() => { console.log("onHide"); setShowDialog(false) }} onShow={() => console.log("onShow")}
                        onMaximize={() => { console.log("onMaximize"); return true }}
                        onMinimize={() => { console.log("onMinimize"); return true }}
                        maximizable>
                        <span>{basicText()}</span>
                        <br />
                        <br />
                        <TextInput ref={onOpenRef} scheme={Scheme.PRIMARY} fill /><br />
                        <br />
                    </Dialog>
                    <div ref={(e) => refs.current["dialogDiv1"] = e} style={{ background: "red", height: 500, overflow: "auto" }}>
                        <div style={{ height: 900, background: "green", width: 300 }}></div>
                    </div>
                </div>
                <div style={{ margin: 30 }}>
                    <FormControl fill invalid={!dropdownIsValid}>
                        <Dropdown fill
                            options={[
                                { code: "CA", c: "fa fa-flag", continent: "North America", label: "Canadanadanadanadanadanada", icon: "https://cdn.countryflags.com/thumbs/canada/flag-3d-round-250.png" },
                                {
                                    label: "Africa",
                                    "items": [
                                        { code: "UG", label: "Uganda", icon: "https://cdn.countryflags.com/thumbs/uganda/flag-3d-round-250.png" },
                                        { code: "NG", label: "Nigeria", icon: "https://cdn.countryflags.com/thumbs/nigeria/flag-3d-round-250.png" },
                                        { code: "TZ", label: "Tanzania", icon: "https://cdn.countryflags.com/thumbs/tanzania/flag-3d-round-250.png" },
                                    ]
                                },
                                {
                                    label: "Asia",
                                    "items": [
                                        { code: "CH", label: "China", icon: "https://cdn.countryflags.com/thumbs/china/flag-3d-round-250.png" },
                                        { code: "IN", label: "India", icon: "https://cdn.countryflags.com/thumbs/india/flag-3d-round-250.png" },
                                        { code: "RU", label: "Russia", icon: "https://cdn.countryflags.com/thumbs/russia/flag-3d-round-250.png" },
                                    ]
                                },
                            ]}
                            cleareable
                            /*highlight editable*/
                            scheme={Scheme.SUCCESS}
                            placeholder='Select a country'
                            optionMap={{
                                label: "{label} - {code}"
                            }} editable
                            onSearch={(e: any) => {
                                console.log(e.target.value);
                                return null;
                            }}
                            optionGroupTemplate={(option: any) => <span>{option?.label}</span>}
                            popoverHeaderTemplate={() => <div style={{ fontWeight: "bold", margin: 0, padding: 10, background: "#f8f9fa", borderBottom: "1px solid #dee2e6" }}>
                                <FormControl rightContent={"fa fa-search"} style={{ width: "100%" }}>
                                    <TextInput fill />
                                </FormControl>
                            </div>}
                            //selectedOptionTemplate={(option: any) => (<div><i className={option?.c}/><span>{option?.label || "Hello"}</span></div>)}
                            popoverFooterTemplate={() => <div style={{ fontWeight: "bold", margin: 10 }}>Yahoo Footer</div>}
                            onSelectOption={(option: any, event: any) => {
                                setDropdownIsValid(true);
                                return true;
                            }}
                            onDeSelectOption={(event: any) => setDropdownIsValid(false)} dontMatchTargetSize />

                    </FormControl>
                </div>
                <div style={{ margin: 30 }}>
                    <Button text="Popover1" onClick={(e: any) => refs.current["popover1"].toggle(e/*, refs.current["portaldiv1"] */)} />
                    <Popover manageRef={(e: any) => refs.current["popover1"] = e} matchTargetSize={false}
                        onOpenFocusRef={onOpenRef} onCloseFocusRef={onCloseRef} pointingArrowClassName={""}
                        style={{ backgroundColor: "white", padding: 10 }}
                        onShow={() => console.log("onShow")} onHide={() => console.log("onHide")}>
                        <span>Hello World pop 1</span><br />
                        <span>Hello World pop 1</span><br />
                        <span>Hello World pop 1</span><br />
                        <span>Hello World pop 1</span><br />
                        <span>Hello World pop 1</span><br />
                        <TextInput ref={onOpenRef} scheme={Scheme.PRIMARY} fill /><br />
                        <span>Hello World pop 1</span><br />
                        <span>Hello World pop 1</span><br />
                        <span>Hello World pop 1</span><br />
                    </Popover>
                    <TextInput ref={onCloseRef} scheme={Scheme.DANGER} fill /><br />
                </div>
                <div style={{ margin: 30 }}>
                    <div ref={(e) => refs.current["portaldiv1"] = e} style={{ background: "red" }}></div>
                    <Portal visible={true}>
                        <span>Hello World</span>
                    </Portal>
                    <Portal visible={true} container={() => refs.current["portaldiv1"]}>
                        <span>Hello World on a custom container</span>
                    </Portal>
                </div>
                <div style={{ margin: 30 }}>
                    <Paginator scheme={Scheme.DARK} totalRecords={123} template={{
                        layout: "PreviousPageElement ActivePageLabel NextPageElement"
                    }} leftContent={<Button className="fa fa-search" scheme={Scheme.PRIMARY} />}
                        rightContent={<TextInput scheme={Scheme.PRIMARY} />} />
                    <Paginator scheme={Scheme.DARK} totalRecords={250} rowsPerPage={40} template={{
                        layout: "PreviousPageElement PageElements NextPageElement"
                    }} />
                    <br />
                    <br />
                    <Paginator scheme={Scheme.DARK} totalRecords={12} rowsPerPage={1} template={{
                        layout: "FirstPageElement PreviousPageElement ActivePageLabel NextPageElement LastPageElement"
                    }} />
                    <br />
                    {Object.keys(Scheme).map((scheme, index) => (
                        <Paginator key={index} expandOnHiddenPagesButtonClicked={true} scheme={schemes[index]} totalRecords={123}
                            onPageChange={(e: any) => console.log("onPageChange:", scheme, e)} style={{
                                color: index === 3 ? "white" : "inherit",
                                background: index === 3 ? "black" : "inherit"
                            }}
                            rightContent={<span key={'rk'}>{`${schemes[index]}`}</span>} />
                    ))}
                </div>
                <div style={{ margin: 30 }}>
                    <FormControl label="Email" infoLabel="Enter the email you'd like to receive the newsletter on."
                        helpLabel="Email is required 1." labelFor="email-inp" invalid={!inputIsValid} required scheme={Scheme.SUCCESS}
                        leftContent="fas fa-shield-alt">
                        <TextInput id="email-inp" style={{ background: "rgba(217, 217, 217, 0.2)", borderRadius: 0 }}
                            onFirstInput={() => setInputIsValid(true)} onInputEmpty={() => setInputIsValid(false)} />
                    </FormControl>
                    <FormControl label="Email" infoLabel="Enter the email you'd like to receive the newsletter on."
                        helpLabel="Email is required 2." labelFor="email-inp" invalid required>
                        <TextInput id="email-inp" scheme={Scheme.PRIMARY} />
                    </FormControl>
                    <br />
                    <br />
                    <FormControl scheme={Scheme.SUCCESS} contentStyle={{ border: "none", borderRadius: 0, display: "flex", flexDirection: "column" }} childrenInvalidPropsMap={{
                        "highlight": true,
                        "scheme": "{invalidScheme}"
                    }} childrenValidPropsMap={{ contentStyle: { borderColor: "rgba(217, 217, 217, 0.2)" } }}
                        helpLabel={<div style={{ marginTop: 15, color: "red" }}>Incorrect login detail</div>} invalid={!inputIsValid} highlight>
                        <FormControl required scheme={Scheme.SUCCESS} style={{ width: "100%", background: "rgba(217, 217, 217, 0.2)" }}
                            contentStyle={{ borderRadius: 0 }} leftContent="fas fa-shield-alt">
                            <TextInput id="email-inp" style={{ borderRadius: 0 }} placeholder='Email'
                                onFirstInput={() => setInputIsValid(true)} noStyle />
                        </FormControl>
                        <FormControl scheme={Scheme.SUCCESS} style={{ marginTop: 20 }} contentStyle={{ borderRadius: 0, width: "100%", background: "rgba(217, 217, 217, 0.2)" }}
                            leftContent="fas fa-key" rightContent={<i className="fas fa-eye" />} >
                            <PasswordInput id="pass-inp" placeholder='Password'
                                onFirstInput={() => setInputIsValid(true)} noStyle />
                        </FormControl>
                    </FormControl>
                    <br />
                    <FormControl label="Password" infoLabel="Your password is secure"
                        helpLabel="Password is required." labelFor="pass-inp2" required>
                        <PasswordInput id="pass-inp2" scheme={Scheme.PRIMARY} />
                    </FormControl>
                    <br />
                    <br />
                    <FormControl label="Terms and conditions" infoLabel="Check this box to sell your soul to us"
                        helpLabel="You must check the box" labelFor="chk-inp" contentStyle={{ border: "none" }} scheme={Scheme.INFO}>
                        <Checkbox id="chk-inp" label="Interbal checkmater" />
                    </FormControl>
                </div>
                <br />
                <br />
                <div style={{ margin: 30 }}>
                    {Object.keys(Scheme).map((scheme, index) => (
                        <ProgressBar key={scheme} scheme={schemes[index]} id={schemes[index]} name={schemes[index]}
                            value={percent(index) as any} labeltemplate={(value: NoseurNummber) => `${scheme} ${value}%`} />
                    ))}
                    <br />
                    <br />
                    <ProgressBar />
                    <ProgressBar value={20} />
                    <ProgressBar value={80} stripped />
                    <ProgressBar />
                    <ProgressBar mode={ProgressBarMode.INDETERMINATE} stripped />
                    <ProgressBar value={5} labeltemplate={(value: NoseurNummber) => `${value}% done`} />
                    <br />
                    <br />
                    {Object.keys(Scheme).map((scheme, index) => (
                        <ProgressBar style={{ height: 6 }} key={scheme} scheme={schemes[index]} mode={ProgressBarMode.INDETERMINATE} />
                    ))}
                    <br />
                    <br />
                    {Object.keys(Scheme).map((scheme, index) => (
                        <ProgressBar key={scheme} scheme={schemes[index]} value={progress.current} />
                    ))}
                    {Object.keys(Scheme).map((scheme, index) => (
                        <ProgressBar key={scheme} scheme={schemes[index]} value={progress.current} noLabel />
                    ))}
                </div>
                <div style={{ margin: 30 }}>
                    <Checkbox />
                    {Object.keys(Scheme).map((scheme, index) => (
                        <Checkbox key={scheme} scheme={schemes[index]} id={schemes[index]} name={schemes[index]} label={schemes[index]}
                            onChange={(e: any) => console.log(scheme, e.checked, e.value, e.checkState)} />
                    ))}
                    <br />
                    <br />
                    <Checkbox label={"Default"} />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Default Primary"} />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Always Render Input"} id="name" name="user-name" alwaysRenderInput />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Checked"} checked />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Checked = false"} checked={false} />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Disabled"} disabled />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Disabled Checked"} disabled checked />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Read only"} readOnly />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Read only Checked"} readOnly checked />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Required"} required />
                    <Checkbox scheme={Scheme.DANGER} label={"Highlight"} highlight />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Default Checked"} defaultChecked />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Checked Index 0"} checkedIndex={0} />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Checked Index 1"} checkedIndex={1} />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Default Checked Index = 1"} defaultCheckedIndex={1} />
                    <br />
                    <br />
                    <Checkbox scheme={Scheme.PRIMARY} checkStates={[
                        {
                            icon: null,
                            value: "none",
                            checked: false,
                            scheme: Scheme.NIL,
                        },
                        {
                            value: "up",
                            checked: true,
                            icon: "fa fa-arrow-up",
                            scheme: Scheme.PRIMARY,
                        },
                        {
                            value: "right",
                            checked: true,
                            scheme: Scheme.WARNING,
                            icon: "fa fa-arrow-right",
                        },
                        {
                            value: "down",
                            checked: true,
                            scheme: Scheme.SUCCESS,
                            icon: "fa fa-arrow-down",
                        },
                        {
                            value: "left",
                            checked: true,
                            scheme: Scheme.INFO,
                            icon: "fa fa-arrow-left",
                        },
                    ]} />
                    <br />
                    <br />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Align Label TOP"} alignLabel={Alignment.TOP} />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Align Label LEFT"} alignLabel={Alignment.LEFT} />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Align Label RIGHT"} alignLabel={Alignment.RIGHT} />
                    <Checkbox scheme={Scheme.PRIMARY} label={"Align Label BOTTOM"} alignLabel={Alignment.BOTTOM} />
                </div>
                <div style={{ margin: 30 }}>
                    {Object.keys(Scheme).map((scheme, index) => (
                        <TextInput key={scheme} scheme={schemes[index]} placeholder={scheme} style={{ margin: 10, fontSize: 15 }}
                            id={schemes[index]} name={schemes[index]} raised required />
                    ))}
                    <TextInput scheme={Scheme.DANGER} style={{ margin: 10 }} placeholder="Highlight" required highlight />
                    <TextInput scheme={Scheme.PRIMARY} style={{ margin: 10 }} defaultValue="Hello World" filled rounded disabled />
                    <TextInput scheme={Scheme.PRIMARY} style={{ margin: 10 }} defaultValue="Hello World" filled rounded readOnly />
                    <TextInput scheme={Scheme.PRIMARY} style={{ margin: 10 }} filled borderless />
                    <TextInput scheme={Scheme.PRIMARY} style={{ margin: 10 }} flushed />
                    <TextInput scheme={Scheme.PRIMARY} style={{ margin: 10 }} type="range" />

                    <NumberInput scheme={Scheme.SUCCESS} style={{ margin: 10 }} placeholder="Number Input" />
                    <EmailInput scheme={Scheme.SUCCESS} style={{ margin: 10 }} placeholder="Email Input" />
                    <PasswordInput scheme={Scheme.SUCCESS} style={{ margin: 10 }} placeholder="Password Input" />
                    <TextAreaInput scheme={Scheme.SUCCESS} style={{ margin: 10 }} placeholder="TextAreaInput Input" />
                    <MoneyInput scheme={Scheme.SUCCESS} style={{ margin: 10 }} placeholder="Money Input" onFirstInput={(e: any) => console.log("Typed", e.target.value)} />
                    <TextInput scheme={Scheme.SUCCESS} style={{ margin: 10 }} defaultValue="012345678901" />
                    <TextInput scheme={Scheme.SUCCESS} style={{ margin: 10 }} placeholder="+234 (XXX) XXXX XXXX" mask="+234 (XXX) XXXX XXXX" maskSlot="X" />
                </div>
                <div style={{ margin: 30 }}>
                    {Object.keys(Scheme).map((scheme, index) => (<Button key={scheme} onClick={() => console.log("Button.onClick", scheme)}
                        className='yahoo' style={{ margin: 10, fontSize: 15 }}
                        text={<span key="title" style={{ fontWeight: "bold" }}>{scheme}</span>}
                        leftIcon="fab fa-twitter" id={schemes[index]}
                        scheme={schemes[index]} raised rippleEffect />))}
                    <Button ref={(e: any) => refs.current["button1"] = e} style={{ margin: 10, fontSize: 15 }} onClick={() => console.log("yahoo", refs.current["button1"])}
                        link="https://thecarisma.github.io"
                        text="Thecarisma Website"
                        leftIcon={""} linkTarget="_blank"
                        scheme={Scheme.DARK} />
                    <Button noStyle ref={(e: any) => refs.current["button2"] = e} style={{ margin: 10, fontSize: 15 }} onClick={() => console.log("yahoo", refs.current["button2"])}
                        link="https://github.com/Thecarisma"
                        text="Thecarisma Github"
                        leftIcon={""}
                        scheme={Scheme.DARK} />
                    <br />
                    <br />
                    <Button text="Hello World" scheme={Scheme.PRIMARY} raised textOnly rippleEffect />
                    <br />
                    <br />
                    <Button leftIcon="fa fa-arrow-right" scheme={Scheme.PRIMARY} fillOnHover outlined />
                    <br />
                    <br />
                    <Button leftIcon="fa fa-angle-right" scheme={Scheme.SECONDARY} style={{ padding: "10px 15px 10px 15px" }} iconOnly raised />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </div>

            </div>
        );
    }

    function basicText() {
        return `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
            labore et dolore magna aliqua. Morbi tempus iaculis urna id. Ut ornare lectus 
            sit amet est placerat in egestas. Sit amet mauris commodo quis imperdiet massa. 
            Dictum sit amet justo donec enim diam vulputate ut pharetra.
        `;
    }
    const chartyMap: NoseurObject<any> = {
        "bar": {
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                datasets: [{
                    label: 'My First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(201, 203, 207, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        },
        "pie": {
            data: {
                labels: [
                    'Red',
                    'Blue',
                    'Yellow'
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [300, 50, 100],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {},
        },
        "line": {
            data: {
                labels: [
                    'Red',
                    'Blue',
                    'Yellow'
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [300, 50, 100],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {}
        },
        "radar": {
            data: {
                labels: [
                    'Eating',
                    'Drinking',
                    'Sleeping',
                    'Designing',
                    'Coding',
                    'Cycling',
                    'Running'
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [65, 59, 90, 81, 56, 55, 40],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }, {
                    label: 'My Second Dataset',
                    data: [28, 48, 40, 19, 96, 27, 100],
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)'
                }]
            },
            options: {},
        },
        "bubble": {
            data: {
                datasets: [{
                    label: 'First Dataset',
                    data: [{
                        x: 20,
                        y: 30,
                        r: 15
                    }, {
                        x: 40,
                        y: 10,
                        r: 10
                    }],
                    backgroundColor: 'rgb(255, 99, 132)'
                }]
            },
            options: {},
        },
        "scatter": {
            data: {
                datasets: [{
                    label: 'Scatter Dataset',
                    data: [{
                        x: -10,
                        y: 0
                    }, {
                        x: 0,
                        y: 10
                    }, {
                        x: 10,
                        y: 5
                    }, {
                        x: 0.5,
                        y: 5.5
                    }],
                    backgroundColor: 'rgb(255, 99, 132)'
                }],
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    }
                }
            },
        },
        "doughnut": {
            data: {
                labels: [
                    'Red',
                    'Blue',
                    'Yellow'
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [300, 50, 100],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {},
        },
        "polarArea": {
            data: {
                labels: [
                    'Red',
                    'Green',
                    'Yellow',
                    'Grey',
                    'Blue'
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [11, 16, 7, 3, 14],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(75, 192, 192)',
                        'rgb(255, 205, 86)',
                        'rgb(201, 203, 207)',
                        'rgb(54, 162, 235)'
                    ]
                }]
            },
            options: {},
        },
        "none": {
            data: {},
            options: {},
        },
    };

    const tableData = [
        {
            logo: "fa fa-user",
            name: "Rivtn User",
            service_code: "janus-lunarius",
        },
        {
            logo: "fa fa-flag",
            name: "Admin",
            service_code: "janus-geminus",
        },
        {
            logo: "fa fa-shield-alt",
            name: "Security System",
            service_code: "soteria",
        },
        {
            logo: "fa fa-gamepad",
            name: "Rideon",
            service_code: "rideon",
        },
        {
            logo: "fa fa-search",
            name: "Logging System",
            service_code: "mnemosyne",
        },
    ];

    return render();

}
//https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#input_types

export default App;
