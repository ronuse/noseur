
import React from 'react';
import "./Presentation.css";
import { DOMHelper } from '../utils/DOMUtils';
import { Classname } from "../utils/Classname";
import { BoolHelper } from '../utils/BoolHelper';
import { NoseurObject } from '../constants/Types';
import { ObjectHelper } from '../utils/ObjectHelper';
import { ComponentBaseProps } from '../core/ComponentBaseProps';
import { Chart as ChartJs, ChartData as ChartJsData, ChartDataCustomTypesPerDataset, ChartTypeRegistry } from 'chart.js/auto';

export const ChartType = {
    BAR: "bar",
    PIE: "pie",
    NONE: "none",
    LINE: "line",
    RADAR: "radar",
    BUBBLE: "bubble",
    SCATTER: "scatter",
    DOUGHNUT: "doughnut",
    POLARAREA: "polarArea",
}

export type ChartData = ChartJsData<any, any[], unknown> | ChartDataCustomTypesPerDataset<any, any[], unknown>;

export interface ChartManageRef {
    getChart: () => any;
    update: (type: ChartTypeRegistry | string, data?: ChartData, options?: NoseurObject<any>) => void;
}

export interface ChartProps extends ComponentBaseProps<HTMLDivElement, ChartManageRef> {
    data: ChartData;
    canvasClassName: string;
    options: NoseurObject<any>;
    canvasProps: NoseurObject<any>;
    type: ChartTypeRegistry | string;
    canvasStyle: React.CSSProperties | undefined;
    canvasElement: React.ForwardedRef<HTMLCanvasElement>;
}

interface ChartState {
    id: string;
}

export class ChartComponent extends React.Component<ChartProps, ChartState> {

    public static defaultProps: Partial<ChartProps> = {
        type: ChartType.LINE,
    };

    state: ChartState = {
        id: this.props.id || DOMHelper.uniqueElementId()
    };

    chart: any;
    canvasElement!: HTMLCanvasElement;

    constructor(props: ChartProps) {
        super(props);

        this.renderChart = this.renderChart.bind(this);
    }

    componentDidMount(): void {
        this.renderChart(this.props.type, this.props.data, this.props.options);
        ObjectHelper.resolveManageRef(this, {
            update: this.renderChart,
            getChart: () => this.chart,
        });
    }

    componentDidUpdate(prevProps: Readonly<ChartProps>, _: Readonly<ChartState>) {
        if (!BoolHelper.deepEqual(this.props, prevProps, ["type", "data", "options"])) {
            this.renderChart(this.props.type, this.props.data, this.props.options);
        }
    }

    componentWillUnmount() {
        ObjectHelper.resolveManageRef(this, null);
    }

    renderChart(type: ChartTypeRegistry | string, data?: ChartData, options?: NoseurObject<any>) {
        if (this.chart) this.chart.destroy();
        this.chart = new ChartJs(this.canvasElement, { type, data: data ?? this.props.data, options, });
    }

    render() {
        const className = Classname.build("noseur-chart", this.props.className);
        const canvasElement = (ref: HTMLCanvasElement) => {
            this.canvasElement = ref;
            ObjectHelper.resolveRef(this.props.canvasElement, ref);
        };

        return (<div className={className} style={this.props.style}>
            <canvas id={this.state.id} style={this.props.canvasStyle} className={this.props.canvasClassName} ref={canvasElement} {...(this.props.canvasProps || {})}></canvas>
        </div>)
    }

}

export const Chart = React.forwardRef<HTMLDivElement, Partial<ChartProps>>((props, _) => (
    <ChartComponent {...props} />
));


