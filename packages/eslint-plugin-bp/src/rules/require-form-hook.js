/**
 * require-form-hook
 * 2 veya daha fazla form input'u iceren component'lerde
 * react-hook-form + Zod kullanimi zorunludur.
 */

import { getJSXElementName } from '../utils/ast-helpers.js';

const FORM_INPUT_ELEMENTS = new Set([
  'TextInput',
  'TextField',
  'Input',
  'Select',
  'Checkbox',
  'Switch',
  'RadioButton',
  'DatePicker',
]);

const SUBMIT_HANDLER_NAMES = new Set([
  'handleSubmit',
  'onSubmit',
  'onSave',
  'onCreate',
  'onUpdate',
]);

const MESSAGE =
  '2+ input iceren formlar react-hook-form + Zod ile yonetilmelidir.';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Birden fazla form input iceren component\'lerde react-hook-form + Zod kullanimi zorunlu kilar.',
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          minInputs: {
            type: 'number',
            default: 2,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      requireFormHook: MESSAGE,
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const minInputs = options.minInputs || 2;

    const filename = context.filename;

    // Test dosyalari istisna
    if (
      filename.includes('.test.') ||
      filename.includes('.spec.') ||
      filename.includes('__tests__/')
    ) {
      return {};
    }

    // Form infrastructure dosyalari istisna
    if (
      filename.includes('/form/') ||
      filename.includes('/forms/') ||
      filename.includes('FormProvider')
    ) {
      return {};
    }

    let inputCount = 0;
    let hasSubmitHandler = false;
    let hasUseForm = false;
    let hasZodResolver = false;
    let programNode = null;

    return {
      Program(node) {
        // State sifirla
        inputCount = 0;
        hasSubmitHandler = false;
        hasUseForm = false;
        hasZodResolver = false;
        programNode = node;
      },

      ImportDeclaration(node) {
        const source = node.source.value;

        // useForm import kontrolu
        if (source === 'react-hook-form') {
          const specifiers = node.specifiers.filter(
            (s) =>
              s.type === 'ImportSpecifier' && s.imported?.name === 'useForm',
          );
          if (specifiers.length > 0) hasUseForm = true;
        }

        // zodResolver import kontrolu
        if (
          source === '@hookform/resolvers/zod' ||
          source === '@hookform/resolvers'
        ) {
          const specifiers = node.specifiers.filter(
            (s) =>
              s.type === 'ImportSpecifier' &&
              s.imported?.name === 'zodResolver',
          );
          if (specifiers.length > 0) hasZodResolver = true;
        }
      },

      // Form input element'lerini say
      JSXOpeningElement(node) {
        const elementName = getJSXElementName(node);
        if (FORM_INPUT_ELEMENTS.has(elementName)) {
          inputCount++;
        }
      },

      // Submit handler tespiti
      VariableDeclarator(node) {
        if (
          node.id?.type === 'Identifier' &&
          SUBMIT_HANDLER_NAMES.has(node.id.name)
        ) {
          hasSubmitHandler = true;
        }
      },

      // Fonksiyon bildirimi olarak submit handler
      FunctionDeclaration(node) {
        if (
          node.id?.type === 'Identifier' &&
          SUBMIT_HANDLER_NAMES.has(node.id.name)
        ) {
          hasSubmitHandler = true;
        }
      },

      'Program:exit'() {
        // Form tespit kriterlerini kontrol et
        const isFormComponent = inputCount >= minInputs || hasSubmitHandler;

        if (isFormComponent && inputCount >= minInputs) {
          if (!hasUseForm || !hasZodResolver) {
            context.report({
              node: programNode,
              messageId: 'requireFormHook',
            });
          }
        }
      },
    };
  },
};
