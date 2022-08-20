import { useBlockProps } from "@wordpress/block-editor";
import classnames from "classnames";
import { filterJsCss, generateCss, gradientBackground } from '../../components/HelperFunction';

export default function save({ attributes }) {
    const blockProps = useBlockProps.save({
        className: classnames(attributes.blockId, {
            ['premium-desktop-hidden']: attributes.hideDesktop,
            ['premium-tablet-hidden']: attributes.hideTablet,
            ['premium-mobile-hidden']: attributes.hideMobile,
        }),
        style: filterJsCss({
            color: attributes?.color,
            boxShadow: `${attributes.boxShadow?.horizontal}px ${attributes.boxShadow?.vertical}px ${attributes.boxShadow?.blur}px ${attributes.boxShadow?.color} ${attributes.boxShadow?.position}`,
            borderStyle: attributes.border?.borderType,
            borderColor: attributes.border?.borderColor,
            fontFamily: attributes.typography?.fontFamily,
            fontStyle: attributes.typography?.fontStyle,
            fontWeight: attributes.typography?.fontWeight,
            textDecoration: attributes.typography?.textDecoration,
            textTransform: attributes.typography?.textTransform,
            ...gradientBackground(attributes?.background)
        })
    })

    const loadStyles = () => {
        const styles = {};
        styles[`.${attributes.blockId}:hover`] = {
            "color": `${attributes?.hoverColor}!important`
        }

        return generateCss(styles);
    };

    return <div {...blockProps}>
        <style>{loadStyles()}</style>
        <p>Hello world (from the frontend)</p>
    </div>;
}



