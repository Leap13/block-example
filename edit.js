
import { withSelect } from '@wordpress/data';
import { useEffect } from 'react';
import { generateBlockId, generateCss, typographyCss, borderCss, paddingCss, marginCss, gradientBackground } from '../../components/HelperFunction';
import {
    InspectorControls, useBlockProps
} from "@wordpress/block-editor";
import PremiumResponsiveTabs from "../../components/premium-responsive-tabs";
import InspectorTabs from "../../components/InspectorTabs";
import InspectorTab from "../../components/InspectorTab";
import { Fragment } from 'react';
import classnames from "classnames";
import PremiumTypo from "../../components/premium-typo";
import WebfontLoader from "../../components/typography/fontLoader";
import InsideTabs from "../../components/InsideTabs";
import InsideTab from "../../components/InsideTab";
import AdvancedPopColorControl from '../../components/Color Control/ColorComponent';
import PremiumBackgroundControl from "../../components/Premium-Background-Control";
import PremiumShadow from "../../components/PremiumShadow";
import PremiumBorder from "../../components/premium-border";
import SpacingComponent from '../../components/premium-responsive-spacing';
import MultiButtonsControl from '../../components/responsive-radio';
import Icons from "../../components/icons";
import ResponsiveRangeControl from "../../components/RangeControl/responsive-range-control";
import { __ } from '@wordpress/i18n';

function Edit({ clientId, attributes, setAttributes, deviceType }) {

    useEffect(() => {
        // Set block id.
        setAttributes({
            blockId:
                "premium-my-block-" + generateBlockId(clientId),
        });
    }, []);

    const blockProps = useBlockProps({
        className: classnames(attributes.blockId, {
            ['premium-desktop-hidden']: attributes.hideDesktop,
            ['premium-tablet-hidden']: attributes.hideTablet,
            ['premium-mobile-hidden']: attributes.hideMobile,
        }),
        style: {
            textAlign: attributes?.align?.[deviceType],
            width: attributes?.width?.[deviceType],
            color: attributes?.color,
            boxShadow: `${attributes.boxShadow?.horizontal}px ${attributes.boxShadow?.vertical}px ${attributes.boxShadow?.blur}px ${attributes.boxShadow?.color} ${attributes.boxShadow?.position}`,
            ...typographyCss(attributes.typography, deviceType),
            ...borderCss(attributes.border, deviceType),
            ...paddingCss(attributes.padding, deviceType),
            ...marginCss(attributes.margin, deviceType),
            ...gradientBackground(attributes.background)
        }
    });

    let loadGoogleFonts;
    if (attributes.typography?.fontFamily !== 'Default') {
        const fontConfig = {
            google: {
                families: [attributes.typography?.fontFamily],
            },
        }
        loadGoogleFonts = (
            <WebfontLoader config={fontConfig}>
            </WebfontLoader>
        )
    }

    const loadStyles = () => {
        const styles = {};
        styles[`.${attributes.blockId}:hover`] = {
            "color": `${attributes?.hoverColor}!important`
        }

        return generateCss(styles);
    };

    return <Fragment>
        <InspectorControls>
            <InspectorTabs tabs={["layout", "style", "advance"]}>
                <InspectorTab key={"layout"}>
                    <ResponsiveRangeControl
                        label={__("Size", 'premium-blocks-for-gutenberg')}
                        value={attributes.width}
                        units={['px', '%']}
                        onChange={newValue => setAttributes({ width: newValue })}
                        showUnit={true}
                        min={1}
                        max={1000}
                    />
                    <MultiButtonsControl
                        choices={[{ value: 'left', label: __('Left', "premium-blocks-for-gutenberg"), icon: Icons.alignLeft }, { value: 'center', label: __('Center', "premium-blocks-for-gutenberg"), icon: Icons.alignCenter }, { value: 'right', label: __('Right', "premium-blocks-for-gutenberg"), icon: Icons.alignRight }]}
                        value={attributes.align}
                        onChange={(align) => setAttributes({ align: align })}
                        label={__("Align", "premium-blocks-for-gutenberg")}
                        showIcons={true} />
                </InspectorTab>
                <InspectorTab key={"style"}>
                    <PremiumTypo
                        components={["responsiveSize", "weight", "family", "spacing", "style", "Upper", "line", "Decoration"]}
                        value={attributes.typography}
                        onChange={newValue => setAttributes({ typography: newValue })}
                    />
                    <PremiumBackgroundControl
                        value={attributes?.background}
                        onChange={(value) =>
                            setAttributes({
                                background: value,
                            })
                        }
                    />
                    <InsideTabs>
                        <InsideTab tabTitle={__("Normal", "premium-blocks-for-gutenberg")}>
                            <AdvancedPopColorControl
                                label={__("Color", "premium-blocks-for-gutenberg")}
                                colorValue={attributes.color}
                                colorDefault={""}
                                onColorChange={(value) => setAttributes({ color: value })}
                            />
                        </InsideTab>
                        <InsideTab tabTitle={__("Hover", "premium-blocks-for-gutenberg")}>
                            <AdvancedPopColorControl
                                label={__("Color", "premium-blocks-for-gutenberg")}
                                colorValue={attributes.hoverColor}
                                colorDefault={""}
                                onColorChange={(value) => setAttributes({ hoverColor: value })}
                            />
                        </InsideTab>
                    </InsideTabs>
                    <PremiumShadow
                        label={__("Box Shadow", "premium-blocks-for-gutenberg")}
                        value={attributes.boxShadow}
                        onChange={(value) => setAttributes({ boxShadow: value })}
                        boxShadow={true}
                    />
                    <PremiumBorder
                        label={__("Border")}
                        value={attributes.border}
                        onChange={(value) => setAttributes({ border: value })}
                    />
                    <SpacingComponent value={attributes.margin} responsive={true} showUnits={true} label={__("Margin")} onChange={(value) => setAttributes({ margin: value })} />
                    <SpacingComponent value={attributes.padding} responsive={true} showUnits={true} label={__("Padding")} onChange={(value) => setAttributes({ padding: value })} />
                </InspectorTab>
                <InspectorTab key={"advance"}>
                    <PremiumResponsiveTabs
                        Desktop={attributes.hideDesktop}
                        Tablet={attributes.hideTablet}
                        Mobile={attributes.hideMobile}
                        onChangeDesktop={(value) =>
                            setAttributes({
                                hideDesktop: value,
                            })
                        }
                        onChangeTablet={(value) =>
                            setAttributes({
                                hideTablet: value,
                            })
                        }
                        onChangeMobile={(value) =>
                            setAttributes({
                                hideMobile: value,
                            })
                        }
                    />
                </InspectorTab>
            </InspectorTabs>
        </InspectorControls>
        <div {...blockProps}>
            <style>{loadStyles()}</style>
            <p>Hello world (from the editor)</p>
            {loadGoogleFonts}
        </div>
    </Fragment>;
}

export default withSelect((select, props) => {
    const { __experimentalGetPreviewDeviceType = null } = select('core/edit-post');
    let deviceType = __experimentalGetPreviewDeviceType ? __experimentalGetPreviewDeviceType() : null;

    return {
        // Editor preview device.
        deviceType: deviceType
    }
})(Edit)


