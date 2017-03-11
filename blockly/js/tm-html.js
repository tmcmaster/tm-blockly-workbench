'use strict';

goog.require('Blockly.Blocks');


Blockly.Blocks.HtmlAttrs = {
  'tm_attr_id' : { name:'ID', label:'id', check: 'String' },
  'tm_attr_name' : { name:'NAME', label:'name', check: 'String' },
  'tm_attr_class' : { name:'CLASS', label:'class', check: 'String' },
  'tm_attr_onfocus' : { name:'FOCUS', label:'onfocus', check: 'String' },
  'tm_attr_onclick' : { name:'ONCLICK', label:'onclick', check: 'String' }
};

Blockly.Blocks.HtmlElements = {
  'tm_textfield' : { name:'TEXTFIELD', label:'TEXTFIELD'},
  'tm_textarea' : { name:'TEXTAREA', label:'TEXTAREA'},
  'tm_button' : { name:'BUTTON', label:'BUTTON'},
  'tm_checkbox' : { name:'CHECKBOX', label:'CHECKBOX'},
  'tm_radio' : { name:'RADIO', label:'RADIO'},
  'tm_select' : { name:'SELECT', label:'SELECT'},
  'tm_option' : { name:'OPTION', label:'OPTION'},
  'tm_div' : { name:'DIV', label:'DIV'},
  'tm_span' : { name:'SPAN', label:'SPAN'},
  'tm_fieldset' : { name:'FIELDSET', label:'FIELDSET'},
  'tm_legend' : { name:'LEGEND', label:'LEGEND'},
  'tm_html' : { name:'HTML', label:'HTML'},
  'tm_head' : { name:'HEAD', label:'HEAD'},
  'tm_body' : { name:'BODY', label:'BODY'},
  'tm_script' : { name:'SCRIPT', label:'SCRIPT'},
  'tm_style' : { name:'STYLE', label:'STYLE'},
  'tm_link' : { name:'LINK', label:'LINK'},
  'tm_meta' : { name:'META', label:'META'}
};

//     this.appendDummyInput().appendField('CSS').appendField(new Blockly.FieldTextInput('selector'));

// Blockly.Blocks['tm_css_block'] = {
//   init: function() {
//     this.appendValueInput("SELECTORS")
//         .setCheck("SELECTOR")
//         .appendField("CSS");
//     this.appendStatementInput("STYLING")
//         .setCheck("STYLE");
//     this.setPreviousStatement(true);
//     this.setNextStatement(true);
//     this.setInputsInline(false);
//     this.setColour(160);
//     this.setTooltip('');
//     this.setHelpUrl('');
//   }
// };

Blockly.Blocks['tm_attributes'] = {
  init: function() {
    this.setColour(300);
    this.appendDummyInput()
        .appendField('Attributes List');
    this.setNextStatement(true);
    this.setTooltip('TBD');
    this.contextMenu = false;
  }
};

var types = Object.keys(Blockly.Blocks.HtmlAttrs);
for (var i in types) {
  var type = types[i];
  var label = Blockly.Blocks.HtmlAttrs[type].label;
  createAttributeBlock(type, label);
};

var elementTypes = Object.keys(Blockly.Blocks.HtmlElements);
for (var i in elementTypes) {
  var type = elementTypes[i];
  var name = Blockly.Blocks.HtmlElements[type].name;
  var label = Blockly.Blocks.HtmlElements[type].label;
  createElementBlock(type, name, label);
  createElementGenerator(type, name, label);
}

function createElementGenerator(type, name, label) {
  Blockly.JavaScript[type] = function(block) {
    var aaa = Blockly.Generator;
    var value_attr_id = getValue(block, 'ID');
    var value_attr_class = getValue(block, 'CLASS');
    //var statements_elements = getValue(block, 'CHILDREN');
    var branch = Blockly.JavaScript.statementToCode(block, 'CHILDREN');
    var aaa = Blockly.JavaScript.addLoopTrap(branch, block.id);

    var code = '<' + label;
    if (value_attr_id != undefined) {
      code += ' id="' + value_attr_id + '"';
    }
    if (value_attr_class != undefined) {
      code += ' class="' + value_attr_class + '"';
    }
    code += '>'
    if (aaa != undefined) {
      code += aaa;
    }
    code += '</' + label + '>';
    return code;
  };
}

function getValue(block, name) {
  var value = Blockly.JavaScript.valueToCode(block, name, Blockly.JavaScript.ORDER_ATOMIC);
  if (value.length == 0) {
    return undefined;
  } else if (value.substring(0,1) == "'") {
    return value.substring(1,value.length-1);
  } else {
    return value;
  }
}

function createAttributeBlock(type, label) {
  Blockly.Blocks[type] = {
    init: function() {
      this.setColour(300);
      this.appendDummyInput()
          .appendField(label);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('TBD');
      this.contextMenu = false;
    }
  };
}

function createElementBlock(type, name, label) {
  Blockly.Blocks[type] = {
    state : {},
    init: function() {
      this.attrList = Object.keys(Blockly.Blocks.HtmlAttrs);
      this.appendDummyInput().appendField(label);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setMutator(new Blockly.Mutator(this.attrList));
      this.setInputsInline(true);
      this.setColour(210);
      this.setTooltip('TBD');
      this.setHelpUrl('TBD');

      for (var i in this.attrList) {
        var type = this.attrList[i];
        this.state[type] = 0;
      };
    },
    mutationToDom: function() {
      var container = document.createElement('mutation');

      for (var i in this.attrList) {
        var type = this.attrList[i];
        var label = Blockly.Blocks.HtmlAttrs[type].label;
        var state = this.state[type];
        container.setAttribute(label, state);
      };

      return container;
    },
    domToMutation: function(xmlElement) {

      for (var i in this.attrList) {
        var type = this.attrList[i];
        var label = Blockly.Blocks.HtmlAttrs[type].label;
        var state = parseInt(xmlElement.getAttribute(label), 10) || 0;
        this.state[type] = state;
      };

      this.updateShape_();
    },
    decompose: function(workspace) {
      var containerBlock = workspace.newBlock('tm_attributes');
      containerBlock.initSvg();
      var connection = containerBlock.nextConnection;

      for (var i in this.attrList) {
        var type = this.attrList[i];
        var state = this.state[type];
        if (state === 1) {
          var newBlock = workspace.newBlock(type);
          newBlock.initSvg();
          connection.connect(newBlock.previousConnection);
        }
      };

      return containerBlock;
    },
    compose: function(containerBlock) {
      var clauseBlock = containerBlock.nextConnection.targetBlock();

      for (var i in this.attrList) {
        var type = this.attrList[i];
        this.state[type] = 0;
      };

      for (var i in this.attrList) {
        var type = this.attrList[i];
        var state = this.state[type];
        this.state[type] = state;
      };

      while (clauseBlock) {
        var type = clauseBlock.type;
        this.state[type] = 1;
        clauseBlock = clauseBlock.nextConnection &&
            clauseBlock.nextConnection.targetBlock();
      }

      this.updateShape_();
    },
    saveConnections: function(containerBlock) {
      var clauseBlock = containerBlock.nextConnection.targetBlock();

      while (clauseBlock) {
        var type = clauseBlock.type;
        var name = Blockly.Blocks.HtmlAttrs[type].name;

        var inputDo = this.getInput(name);
        clauseBlock.statementConnection_ =
            inputDo && inputDo.connection.targetConnection;

        clauseBlock = clauseBlock.nextConnection &&
            clauseBlock.nextConnection.targetBlock();
      }

    },
    updateShape_: function() {

      for (var i in this.attrList) {
        var type = this.attrList[i];
        var name = Blockly.Blocks.HtmlAttrs[type].name;
        this.removeInput(name);
      };

      this.removeInput("CHILDREN");

      for (var i in this.attrList) {
        var type = this.attrList[i];
        var name = Blockly.Blocks.HtmlAttrs[type].name;
        var label = Blockly.Blocks.HtmlAttrs[type].label;
        var state = this.state[type];
        if (state === 1) {
          this.appendValueInput(name)
              .appendField(label)
              .setCheck('String');
        }
      };

      this.appendStatementInput("CHILDREN")
          .setCheck(null)
          .appendField();

    }
  };
}

// This is a scratch work inprogress saveConnections

Blockly.Blocks['tm_css_block'] = {
  init: function() {
    this.appendValueInput("CSS_SELECTOR")
        .setCheck(["CSS_CLASS_SELECTOR", "CSS_ID_SELECTOR", "CSS_TYPE_SELECTOR", "CSS_SELECTOR_SET"])
        .appendField("CSS_BLOCK");
    this.appendStatementInput("NAME")
        .setCheck("CSS_DECLARATION");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "CSS_BLOCK");
    this.setNextStatement(true, "CSS_BLOCK");
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript['tm_css_block'] = function(block) {
  var value_css_selector = Blockly.JavaScript.valueToCode(block, 'CSS_SELECTOR', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  //var className = block.childBlocks_[0].inputList[0].fieldRow[1].text_;
  //var className = block.getFieldValue('CSS_CLASS_SELECTOR_VALUE');
  //var className = Blockly.JavaScript.valueToCode(block, 'CSS_CLASS_SELECTOR_VALUE', Blockly.JavaScript.ORDER_ADDITION) || 'FFFF';
  var className = block.childBlocks_[0].getFieldValue('CSS_CLASS_SELECTOR_VALUE') || 'AAA';
  //var className = getInputValue(block, 'tm_selector_class', )
  console.log('value_css_selector: ' + value_css_selector);
  console.log('statements_name: ' + statements_name);
  var code = '.' + className + ' {\n' + statements_name + '\n}';
  return code;
};

function getInputValue(block, inputType, inputName) {
  for (var i in block.childBlocks_) {
    if (block.childBlocks_[i].type === inputType)
    {
      var inputBlock = block.childBlocks_[i];
      return inputBlock.getFieldValue(inputName);
    }
  }
  return undefined;
}

Blockly.Blocks['tm_css_class_selector'] = {
  init: function() {
    this.appendValueInput("CSS_CLASS_SELECTOR")
        .setCheck("String")
        .appendField("class selector");
    this.setInputsInline(true);
    this.setOutput(true, "CSS_CLASS_SELECTOR");
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript['tm_css_class_selector'] = function(block) {
  var value_css_class_selector = Blockly.JavaScript.valueToCode(block, 'CSS_CLASS_SELECTOR', Blockly.JavaScript.ORDER_ATOMIC);
  console.log('value_css_class_selector: ' + value_css_class_selector);
  var code = '.aaa';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['tm_selector_class'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("class")
        .appendField(new Blockly.FieldTextInput(""), "CSS_CLASS_SELECTOR_VALUE");
    this.setOutput(true, "CSS_CLASS_SELECTOR");
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript['tm_selector_class'] = function(block) {
  var text_name = block.getFieldValue('CSS_CLASS_SELECTOR_VALUE');
  console.log('text_name: ' + text_name);
  var code = '.aa';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['tm_css_border'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("border:")
        .appendField(new Blockly.FieldDropdown([["solid","solid"], ["dashed","dashed"], ["dotted","dotted"]]), "TYPE")
        .appendField(new Blockly.FieldDropdown([["red","red"], ["blue","blue"], ["green","green"]]), "COLOR")
        .appendField(new Blockly.FieldTextInput("1"), "SIZE");
    this.appendDummyInput()
        .appendField("px");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript['tm_css_border'] = function(block) {
  var type = block.getFieldValue('TYPE');
  var color = block.getFieldValue('COLOR');
  var size = block.getFieldValue('SIZE');
  var code = 'border: ' + type + ' ' + color + ' ' + size + ' px;\n';
  return code;
};
