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

Blockly.Blocks['tm_css_block'] = {
  init: function() {
    this.appendValueInput("SELECTORS")
        .setCheck("SELECTOR")
        .appendField("CSS");
    this.appendStatementInput("STYLING")
        .setCheck("STYLE");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(false);
    this.setColour(160);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

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
  } else if (value.substring(1,1) == "'") {
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
