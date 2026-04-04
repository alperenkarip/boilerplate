/**
 * no-inline-text-style
 * Text/Typography component'lerinde inline color, fontSize, fontWeight yasaktir.
 * className ile semantic token kullanilmalidir.
 */

import { isInsideAnimatedStyle, getJSXElementName } from '../utils/ast-helpers.js';

const TEXT_COMPONENTS = new Set([
  'Text',
  'Typography',
  'Heading',
  'Paragraph',
  'Label',
  'Caption',
  'Title',
  'Subtitle',
]);

const FORBIDDEN_STYLE_PROPS = new Set([
  'color',
  'fontSize',
  'fontWeight',
]);

const MESSAGE =
  'Text bilesenlerinde inline stil yerine className ile token kullanin (orn: text-bp-content, text-bp-h1)';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Text component\'lerinde inline color/fontSize/fontWeight kullanimini yasaklar.',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      noInlineTextStyle: MESSAGE,
    },
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        const elementName = getJSXElementName(node);

        // Sadece Text/Typography component'leri kontrol et
        if (!TEXT_COMPONENTS.has(elementName)) return;

        // style prop'unu bul
        const styleAttr = node.attributes.find(
          (attr) =>
            attr.type === 'JSXAttribute' && attr.name?.name === 'style',
        );

        if (!styleAttr || !styleAttr.value) return;

        // style={{ ... }} formatinda mi?
        if (styleAttr.value.type !== 'JSXExpressionContainer') return;

        const expression = styleAttr.value.expression;

        // Reanimated animated style icerisindeyse atla
        if (isInsideAnimatedStyle(expression)) return;

        // ObjectExpression: style={{ color: 'red' }}
        if (expression.type === 'ObjectExpression') {
          checkStyleProperties(context, node, expression.properties);
        }

        // ArrayExpression: style={[{ color: 'red' }, styles.base]}
        if (expression.type === 'ArrayExpression') {
          for (const element of expression.elements) {
            if (element && element.type === 'ObjectExpression') {
              checkStyleProperties(context, node, element.properties);
            }
          }
        }
      },
    };
  },
};

/**
 * Style property'lerinde yasakli prop var mi kontrol eder.
 * @param {import('eslint').Rule.RuleContext} context
 * @param {import('estree-jsx').JSXOpeningElement} node
 * @param {import('estree').Property[]} properties
 */
function checkStyleProperties(context, _node, properties) {
  for (const prop of properties) {
    if (
      prop.type === 'Property' &&
      prop.key?.type === 'Identifier' &&
      FORBIDDEN_STYLE_PROPS.has(prop.key.name)
    ) {
      context.report({
        node: prop,
        messageId: 'noInlineTextStyle',
      });
    }
  }
}
