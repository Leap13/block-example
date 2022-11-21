
import { withSelect } from '@wordpress/data';
import { useEffect } from 'react';
import {
    InspectorControls, useBlockProps
} from "@wordpress/block-editor";
import { Fragment } from 'react';
import classnames from "classnames";
import { __ } from '@wordpress/i18n';
import {
    InspectorTabs,
    InspectorTab,
    Icons,
    PremiumBorder,
    PremiumResponsiveTabs,
    MultiButtonsControl,
    PremiumBackgroundControl,
    AdvancedColorControl as AdvancedPopColorControl,
    PremiumShadow,
    WebfontLoader,
    PremiumTypo,
    SpacingComponent,
    ResponsiveRangeControl,
    InsideTabs,
    InsideTab,
} from "@pbg/components";
import { generateBlockId, generateCss, typographyCss, borderCss, paddingCss, marginCss, gradientBackground } from '@pbg/helpers';

function Edit({ clientId, attributes, setAttributes, deviceType }) {
    const {
        blockId,
        hideDesktop,
        hideTablet,
        hideMobile,
        align,
        width,
        color,
        boxShadow,
        typography,
        border,
        padding,
        margin,
        background,
        hoverColor
    } = attributes;

    useEffect(() => {
        // Set block id.
        setAttributes({
            blockId:
                "premium-my-block-" + generateBlockId(clientId),
        });
    }, []);

    const blockProps = useBlockProps({
        className: classnames(blockId, {
            ['premium-desktop-hidden']: hideDesktop,
            ['premium-tablet-hidden']: hideTablet,
            ['premium-mobile-hidden']: hideMobile,
        }),
        style: {
            textAlign: align?.[deviceType],
            width: width?.[deviceType],
            color: color,
            boxShadow: `${boxShadow?.horizontal}px ${boxShadow?.vertical}px ${boxShadow?.blur}px ${boxShadow?.color} ${boxShadow?.position}`,
            ...typographyCss(typography, deviceType),
            ...borderCss(border, deviceType),
            ...paddingCss(padding, deviceType),
            ...marginCss(margin, deviceType),
            ...gradientBackground(background)
        }
    });

    let loadGoogleFonts;
    const googleFonts = [];
    if (typography?.fontFamily !== 'Default') {
        googleFonts.push(typography?.fontFamily);
    }
    if (googleFonts.length > 0) {
        loadGoogleFonts = (
            <WebfontLoader config={{
                families: googleFonts,
            }}>
            </WebfontLoader>
        )
    }

    const loadStyles = () => {
        const styles = {};
        styles[`.${blockId}:hover`] = {
            "color": `${hoverColor}!important`
        }

        return generateCss(styles);
    };

    return <Fragment>
        <InspectorControls>
            <InspectorTabs tabs={["layout", "style", "advance"]}>
                <InspectorTab key={"layout"}>
                    <ResponsiveRangeControl
                        label={__("Size", 'premium-blocks-for-gutenberg')}
                        value={width}
                        units={['px', '%']}
                        onChange={newValue => setAttributes({ width: newValue })}
                        showUnit={true}
                        min={1}
                        max={1000}
                    />
                    <MultiButtonsControl
                        choices={[{ value: 'left', label: __('Left', "premium-blocks-for-gutenberg"), icon: Icons.alignLeft }, { value: 'center', label: __('Center', "premium-blocks-for-gutenberg"), icon: Icons.alignCenter }, { value: 'right', label: __('Right', "premium-blocks-for-gutenberg"), icon: Icons.alignRight }]}
                        value={align}
                        onChange={(align) => setAttributes({ align: align })}
                        label={__("Align", "premium-blocks-for-gutenberg")}
                        showIcons={true} />
                </InspectorTab>
                <InspectorTab key={"style"}>
                    <PremiumTypo
                        value={typography}
                        onChange={newValue => setAttributes({ typography: newValue })}
                    />
                    <PremiumBackgroundControl
                        value={background}
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
                                colorValue={color}
                                colorDefault={""}
                                onColorChange={(value) => setAttributes({ color: value })}
                            />
                        </InsideTab>
                        <InsideTab tabTitle={__("Hover", "premium-blocks-for-gutenberg")}>
                            <AdvancedPopColorControl
                                label={__("Color", "premium-blocks-for-gutenberg")}
                                colorValue={hoverColor}
                                colorDefault={""}
                                onColorChange={(value) => setAttributes({ hoverColor: value })}
                            />
                        </InsideTab>
                    </InsideTabs>
                    <PremiumShadow
                        label={__("Box Shadow", "premium-blocks-for-gutenberg")}
                        value={boxShadow}
                        onChange={(value) => setAttributes({ boxShadow: value })}
                        boxShadow={true}
                    />
                    <PremiumBorder
                        label={__("Border")}
                        value={border}
                        onChange={(value) => setAttributes({ border: value })}
                    />
                    <SpacingComponent value={margin} responsive={true} showUnits={true} label={__("Margin")} onChange={(value) => setAttributes({ margin: value })} />
                    <SpacingComponent value={padding} responsive={true} showUnits={true} label={__("Padding")} onChange={(value) => setAttributes({ padding: value })} />
                </InspectorTab>
                <InspectorTab key={"advance"}>
                    <PremiumResponsiveTabs
                        Desktop={hideDesktop}
                        Tablet={hideTablet}
                        Mobile={hideMobile}
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


