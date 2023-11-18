
import React from 'react';
import {
    Button, Dialog, ChartData,
    TextInput, Dropdown, Scheme, FormGroup,
    MoneyInput, EmailInput, PasswordInput, alertDialog,
    TextAreaInput, NumberInput, NoseurObject, ComposedPassword,
    Checkbox, Alignment, ProgressBar, ProgressBarMode, NoseurNummber, FormControl, Paginator,
    Popover, Portal, Table, Column, PaginatorPageChangeOption, SortMode, Chart, ChartType, AlertDialog, AlertPopover
} from "@ronuse/noseur";

function Schemer() {
    const nameRef = React.useRef<HTMLInputElement>(null);
    const outputRef = React.useRef<HTMLInputElement>(null);
    const mainColorRef = React.useRef<HTMLInputElement>(null);
    const accentColorRef = React.useRef<HTMLInputElement>(null);
    const [scheme,setScheme] = React.useState<any>(Scheme.PRIMARY);
    const secondaryAccentColorRef = React.useRef<HTMLInputElement>(null);

    return (<FormGroup scheme={scheme} style={{ display: "flex", flexDirection: "column", margin: 20 }} childrenStyle={{ marginTop: 20 }}>
        <FormControl label="Name" fill>
            <TextInput ref={nameRef} placeholder="name" defaultValue={"rivtn-quirinus"} />
        </FormControl>
        <FormControl label="Main color" fill>
            <TextInput ref={mainColorRef} placeholder="main color" defaultValue={"#0FA883"} />
        </FormControl>
        <FormControl label="Accent color" fill>
            <TextInput ref={accentColorRef} placeholder="accent color" defaultValue={"#FFFFFF"} />
        </FormControl>
        <FormControl label="Secondary Accent color" fill>
            <TextInput ref={secondaryAccentColorRef} placeholder="secondary accent color" defaultValue={"#EDF7F5"} />
        </FormControl>
        <Button text="Generate Scheme" onClick={generateScheme} />
        <TextAreaInput ref={outputRef}/>
        <br />
        <hr style={{ width: "100%" }} />
        <br />
        <Table paginate scheme={scheme} data={tableData} stripedRows showGridlines={false} hideHeaders={false}
            sortMode={SortMode.MULTIPLE} style={{ marginTop: 20 }} noDivider
            paginatorTemplate={{ layout: "PreviousPageElement PageElements NextPageElement" }}>
            <Column template={(logo: any) => <i className={logo} />} dataKey="logo" />
            <Column canUnsort sortable header="Name" dataKey="name" />
            <Column canUnsort sortable header="Service Code" dataKey="service_code" />
        </Table>

        hle
    </FormGroup>);

    function generateScheme() {
        const name = nameRef.current?.value;
        const mainColor = mainColorRef.current?.value;
        const accentColor = accentColorRef.current?.value;
        const secondaryAccentColor = secondaryAccentColorRef.current?.value;


        console.log(">>>>>", `${hexToRgbA(mainColor, 0.7)}`);
        const schemeCss = `
.${name} {
    color: ${accentColor};
    border-color: ${mainColor};
    background-color: ${mainColor};
}
.${name}-vars {
    --fixtureColor: ${accentColor};
	--fixtureBackgroundColor: ${mainColor};
	--dataBorderColor: ${secondaryAccentColor};
	--stripColor: ${hexToRgbA(mainColor, 0.07)};
}
.${name}-tx,
.${name}-tx-hv:hover {
    color: ${mainColor};
}

.${name}-bd-cl,
.${name}-bd-cl-fc:focus,
.${name}-bd-cl-hv:hover {
    border-color: ${mainColor};
}

.${name}-bg-hv:hover {
    color: ${accentColor};
	background-color: ${mainColor};
}

.${name}-bd-3px-bx-sw-ac:active,
.${name}-bd-3px-bx-sw-fc:focus {
    box-shadow: 0 0 0 3px ${hexToRgbA(mainColor, .3)};
	-moz-box-shadow: 0 0 0 3px ${hexToRgbA(mainColor, .3)};
	-webkit-box-shadow: 0 0 0 3px ${hexToRgbA(mainColor, .3)};
}

.${name}-bd-rd {
    box-shadow: 1px 2.5px 5px ${hexToRgbA(mainColor, 0.25)};
	-moz-box-shadow: 1px 2.5px 5px ${hexToRgbA(mainColor, 0.25)};
	-webkit-box-shadow: 1px 2.5px 5px ${hexToRgbA(mainColor, 0.25)};
}

.${name}>.noseur-rp {
    background-color: ${hexToRgbA(accentColor, 0.7)};
}

.${name}-rp>.noseur-rp {
    background-color: ${hexToRgbA(accentColor, 0.7)};
}
`;

        if (outputRef.current) {
            outputRef.current.value = schemeCss;
        }
        document.head.insertAdjacentHTML("beforeend", `<style>${schemeCss}</style>`);
        setScheme(name);
    }

    function hexToRgbA(hex: any, alpha = 1){
        var c: any;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(', ')+', ' + alpha + ')';
        }
        throw new Error('Bad Hex');
    }
}

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

export default Schemer;
