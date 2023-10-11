import React from 'react';
import {
    Button, Dialog, ChartData,
    TextInput, Dropdown, Scheme,
    MoneyInput, EmailInput, PasswordInput, alertDialog,
    TextAreaInput, NumberInput, NoseurObject, ComposedPassword,
    Checkbox, Alignment, ProgressBar, ProgressBarMode, NoseurNummber, FormControl, Paginator,
    Popover, Portal, Table, Column, PaginatorPageChangeOption, SortMode, Chart, ChartType, AlertDialog, AlertPopover
} from "@ronuse/noseur";
import { AlertInterface, alertPopover, loadingAlert } from '@ronuse/noseur/dist/esm/compose/overlay/Alert';

function App() {
    let progress = React.useRef(0);
    const schemes = Object.values(Scheme);
    const onOpenRef = React.useRef<any>();
    const onCloseRef = React.useRef<any>();
    const [state, setState] = React.useState(false);
    const [charty, setCharty] = React.useState<any>(ChartType.BAR);
    const [showDialog, setShowDialog] = React.useState<boolean>(false);
    const [inputIsValid, setInputIsValid] = React.useState<boolean>(false);
    const [dropdownIsValid, setDropdownIsValid] = React.useState<boolean>(false);
    const [showRivtnDialog, setShowRivtnDialog] = React.useState<boolean>(false);
    const [showAlertDialog, setShowAlertDialog] = React.useState<boolean>(false);
    const [showAlertPopover, setShowAlertPopover] = React.useState<boolean>(false);
    const refs = React.useRef<NoseurObject<any>>({ "input1": { current: undefined } });
    const [dialogAlignment, setDialogAlignment] = React.useState<Alignment>(Alignment.CENTER);
    const [dynamicDataTable, setDynamicDataTable] = React.useState<number[]>(Array(5).fill(0));
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

    const percent = (index: number): number => (index * 100) / schemes.length + 2;

    React.useEffect(() => {
        /*if (progress.current < 100) setTimeout(() => {
            setState(!state);
            progress.current += 7;
        }, 1000);*/
    }, [state]);

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
    const loadingD = loadingAlert({
        message: "Hello World",
        onLoading: async (alert: AlertInterface) => {
            setTimeout(() => {
                alert.doneLoading();
            }, 5000);
            return false;
        }
    });

    return (
        <div className="Apps" style={{ background: "white" }}>
            <div style={{ margin: 30 }}>
                <Button text={"Show Alert Dialog Func"} onClick={() => alertDialog({
                    message: "Hello World"
                }).show()} />
                <Button text={"Show Alert Popover Func"} onClick={() => alertPopover({
                    message: "Hello World"
                }).show()} />
                <Button text={"Show Alert Loading"} onClick={() => loadingD.show()} />
                <Button text={"Show Alert Dialog"} onClick={() => setShowAlertDialog(!showAlertDialog)} />
                <AlertDialog icon="fa fa-circle" visible={showAlertDialog} onHide={() => setShowAlertDialog(!showAlertDialog)} message={
                    (<p>
                        Are you sure you want to delete the email <br />
                        <b>address@domain.com</b> from this account. <br />
                        You can always add another email.
                    </p>)
                } alignFooter={Alignment.CENTER} alignment={Alignment.TOP}/>
                
                <Button text={"Show Alert Popover"} onClick={() => setShowAlertPopover(!showAlertPopover)} />
                <AlertPopover visible={showAlertPopover} onHide={() => setShowAlertPopover(!showAlertPopover)} message={
                    (<p>
                        Are you sure you want to delete the email <br />
                        <b>address@domain.com</b> from this account. <br />
                        You can always add another email.
                    </p>)
                } alignFooter={Alignment.CENTER} alignment={Alignment.TOP}/>
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
                    onSelectOption={(option: any) => setCharty(option.value)} selectedOptionIndex={0} />
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
                    <Column sortable style={{ width: '25%' }} header="Name" dataKey="name" />
                    <Column sortable style={{ width: '25%' }} header="Service Code" dataKey="service_code" canUnsort />
                </Table>
                <Table paginate scheme={Scheme.PRIMARY} stripedRows showGridlines={true} hideHeaders={false}
                    header={() => (<div style={{ fontWeight: "bold", margin: 0, background: "#f8f9fa" }}>
                        <FormControl rightContent={"fa fa-search"} style={{ width: "100%" }}>
                            <TextInput fill />
                        </FormControl>
                    </div>)} style={{ marginTop: 20 }} rowsPerPage={5}
                    paginatorTemplate={{ layout: "PreviousPageElement PageElements NextPageElement" }} footer={() => "The foooter"}
                    data={Array(30).fill(null).map((_, i) => ({ name: "Platform " + (i + 1), service_code: "svc_" + (i + 1), logo: "fa fa-" + Math.min(9, i + 1), }))}>
                    <Column template={(logo: any) => <i className={logo} />} dataKey="logo" />
                    <Column header="Name" dataKey="name" />
                    <Column header="Service Code" dataKey="service_code" />
                </Table>
                <Table paginate scheme={Scheme.DANGER} data={tableData} stripedRows showGridlines={false} hideHeaders={false}
                    sortMode={SortMode.MULTIPLE} style={{ marginTop: 20 }} noDivider
                    paginatorTemplate={{ layout: "PreviousPageElement PageElements NextPageElement" }}>
                    <Column template={(logo: any) => <i className={logo} />} dataKey="logo" />
                    <Column canUnsort sortable header="Name" dataKey="name" />
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
                    onSelectOption={(option: any) => setDialogAlignment(option.value || Alignment.CENTER)} />
                <br />
                <Button text="Show Basic" leftIcon="fa fa-clone fa-flip-vertical" scheme={Scheme.PRIMARY} onClick={() => setShowDialog(!showDialog)} />
                <Button text="Show Basic" leftIcon="fa fa-clone fa-flip-vertical" scheme={Scheme.SUCCESS} onClick={() => setShowRivtnDialog(!showRivtnDialog)} />

                <Dialog visible={showRivtnDialog} style={{ maxWidth: 400 }} onHide={() => setShowRivtnDialog(false)} alignment={dialogAlignment} notClosable>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <span>Request New 2fa Authenticator</span>
                        <p>A new 2fa QR code and plain text has been sent to your email address.</p>
                        <svg width="168" height="168" viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: 30, marginBottom: 40 }}>
                            <path d="M72.3337 99L54.417 81.0833C52.8892 79.5556 50.9448 78.7917 48.5837 78.7917C46.2225 78.7917 44.2781 79.5556 42.7503 81.0833C41.2225 82.6111 40.4587 84.5556 40.4587 86.9167C40.4587 89.2778 41.2225 91.2222 42.7503 92.75L66.5003 116.5C68.167 118.167 70.1114 119 72.3337 119C74.5559 119 76.5003 118.167 78.167 116.5L125.25 69.4167C126.778 67.8889 127.542 65.9445 127.542 63.5833C127.542 61.2222 126.778 59.2778 125.25 57.75C123.723 56.2222 121.778 55.4583 119.417 55.4583C117.056 55.4583 115.111 56.2222 113.584 57.75L72.3337 99ZM84.0003 167.333C72.4725 167.333 61.6392 165.144 51.5003 160.767C41.3614 156.389 32.542 150.453 25.042 142.958C17.542 135.458 11.6059 126.639 7.23366 116.5C2.86144 106.361 0.672548 95.5278 0.666992 84C0.666992 72.4722 2.85588 61.6389 7.23366 51.5C11.6114 41.3611 17.5475 32.5417 25.042 25.0417C32.542 17.5417 41.3614 11.6056 51.5003 7.23334C61.6392 2.86112 72.4725 0.672227 84.0003 0.666672C95.5281 0.666672 106.361 2.85556 116.5 7.23334C126.639 11.6111 135.459 17.5472 142.959 25.0417C150.459 32.5417 156.398 41.3611 160.775 51.5C165.153 61.6389 167.339 72.4722 167.334 84C167.334 95.5278 165.145 106.361 160.767 116.5C156.389 126.639 150.453 135.458 142.959 142.958C135.459 150.458 126.639 156.397 116.5 160.775C106.361 165.153 95.5281 167.339 84.0003 167.333Z" fill="#0FA883" />
                        </svg>
                        <Button text="Close" scheme={Scheme.SUCCESS} onClick={() => setShowRivtnDialog(false)} fill />
                    </div>
                </Dialog>
                <Dialog visible={showDialog} disableScroll={true} alignment={dialogAlignment} notClosable={false}
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
                <FormControl invalid={!dropdownIsValid}>
                    <Dropdown
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
                        onSearch={(v: any) => console.log(v)}
                        optionGroupTemplate={(option: any) => <span>{option?.label}</span>}
                        popoverHeaderTemplate={() => <div style={{ fontWeight: "bold", margin: 0, padding: 10, background: "#f8f9fa", borderBottom: "1px solid #dee2e6" }}>
                            <FormControl rightContent={"fa fa-search"} style={{ width: "100%" }}>
                                <TextInput fill />
                            </FormControl>
                        </div>}
                        //selectedOptionTemplate={(option: any) => (<div><i className={option?.c}/><span>{option?.label || "Hello"}</span></div>)}
                        popoverFooterTemplate={() => <div style={{ fontWeight: "bold", margin: 10 }}>Yahoo Footer</div>}
                        onSelectOption={(option: any, event: any) => setDropdownIsValid(true)}
                        onDeSelectOption={(event: any) => setDropdownIsValid(false)} />

                </FormControl>
            </div>
            <div style={{ margin: 30 }}>
                <Button text="Popover1" onClick={(e: any) => refs.current["popover1"].toggle(e/*, refs.current["portaldiv1"]*/)} />
                <Popover selfRef={(e: any) => refs.current["popover1"] = e} matchTargetSize={false}
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
                    helpLabel="You must check the box" labelFor="chk-inp" invalid contentStyle={{ border: "none" }}>
                    <Checkbox id="chk-inp" scheme={Scheme.INFO} />
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

    function basicText() {
        return `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
            labore et dolore magna aliqua. Morbi tempus iaculis urna id. Ut ornare lectus 
            sit amet est placerat in egestas. Sit amet mauris commodo quis imperdiet massa. 
            Dictum sit amet justo donec enim diam vulputate ut pharetra.
        `;
    }

}
//https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#input_types

export default App;
