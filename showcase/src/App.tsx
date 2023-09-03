import React from 'react';
import {
    Button,
    TextInput, Scheme,
    TextAreaInput, NumberInput,
    MoneyInput, EmailInput, PasswordInput,
    Checkbox, Alignment, ProgressBar, ProgressBarMode, NoseurNummber, FormControl, Paginator
} from "@ronuse/noseur";

function App() {
    let progress = React.useRef(0);
    const schemes = Object.values(Scheme);
    const ref = React.useRef<HTMLButtonElement>(null);
    //const [state, setState] = React.useState(false);

    const percent = (index: number): number => (index * 100) / schemes.length + 2;

    /*React.useEffect(() => {
        if (progress.current < 100) setTimeout(() => {
            setState(!state);
            progress.current += 50;
        }, 1000);
    }, [state]);*/

    return (
        <div className="Apps">
            <div style={{ marginTop: 50 }}>
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
                        onPageChange={(e) => console.log("onPageChange:", scheme, e)} style={{ 
                            color: index === 3 ? "white" : "inherit",
                            background: index === 3 ? "black" : "inherit"}}
                        rightContent={<span key={'rk'}>{`${schemes[index]}`}</span>}/>
                ))}
            </div>
            <div style={{ marginTop: 50 }}>
                <FormControl label="Email" infoLabel="Enter the email you'd like to receive the newsletter on."
                    helpLabel="Email is required." labelFor="email-inp" isValid={true} required>
                    <TextInput id="email-inp" scheme={Scheme.PRIMARY} />
                </FormControl>
                <br />
                <br />
                <FormControl label="Password" infoLabel="Your password is secure"
                    helpLabel="Password is required." labelFor="pass-inp" isValid={false} required>
                    <PasswordInput id="pass-inp" scheme={Scheme.PRIMARY} />
                </FormControl>
                <br />
                <br />
                <FormControl label="Terms and conditions" infoLabel="Check this box to sell your soul to us"
                    helpLabel="You must check the box" labelFor="chk-inp" isValid={false}>
                    <Checkbox id="chk-inp" scheme={Scheme.INFO} />
                </FormControl>
            </div>
            <br />
            <br />
            <div style={{ marginTop: 50 }}>
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
            <div style={{ marginTop: 50 }}>
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
            <div style={{ marginTop: 50 }}>
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
            <div style={{ marginTop: 50 }}>
                {Object.keys(Scheme).map((scheme, index) => (<Button key={scheme} onClick={() => console.log("Button.onClick", scheme)}
                    className='yahoo' style={{ margin: 10, fontSize: 15 }}
                    text={<span key="title" style={{ fontWeight: "bold" }}>{scheme}</span>}
                    leftIcon="fab fa-twitter" id={schemes[index]}
                    scheme={schemes[index]} raised rippleEffect />))}
                <Button ref={ref} style={{ margin: 10, fontSize: 15 }} onClick={() => console.log("yahoo", ref)}
                    link="https://thecarisma.github.io"
                    text="Thecarisma Website"
                    leftIcon={""} linkTarget="_blank"
                    scheme={Scheme.DARK} />
                <Button noStyle ref={ref} style={{ margin: 10, fontSize: 15 }} onClick={() => console.log("yahoo", ref)}
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
            </div>

        </div>
    );

}
//https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#input_types

export default App;
