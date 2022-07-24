//when have children
function expandedTemplate(params = {}) {
  const { key, strType } = params;
  return `
  <>
    <div class="line">
      <div class=""><i class="fas caret-icon  fa-caret-down"></i></div>
      <div class="json-key">${key !== "object" ? `"${key}"` : key}</div>
      <div class="mx-1">${key !== "object" ? `:` : ""}</div>
      <div class="json-size hiddenClass">${strType ? strType : ""}</div>
    </div>
    </>
  `;
}

//show content of nesting (key-value pair)
function notExpandedTemplate(params = {}) {
  const { key, value, type, parent } = params;
  const checkArray = Array.isArray(parent.value);
  return `
  <>
    <div class="line">
      <div class="empty-icon"></div>
      <div class="json-key">${checkArray ? key : `"${key}"`}</div>
      <div class="mx-1">:</div>
      <div class=${
        type === "number"
          ? "json-number"
          : type === "string"
          ? "json-string"
          : "json-boolean"
      }>${typeof value === "string" ? `"${value}"` : value}</div>
    </div>
    </>
  `;
}

//create main div
function createContainerElement() {
  const el = document.createElement("div");
  el.class = "json-container";
  return el;
}

// collapsed node
function hideNodeChildren(node) {
  node.children.forEach((child) => {
    child.el.classList.add("hiddenClass");
    child.el.classList.remove("line");
    if (child.isExpanded) {
      hideNodeChildren(child);
    }
  });
}

//expand node to show it's children
function showNodeChildren(node) {
  node.children.forEach((child) => {
    child.el.classList.remove("hiddenClass");
    child.el.classList.add("line");
    if (child.isExpanded) {
      showNodeChildren(child);
    }
  });
}

// add caret-down icon
function setCaretIconDown(node) {
  if (node.children.length > 0) {
    const icon = node.el.querySelector(".fas");
    const dottedIcon = node.el.querySelector(".json-size");
    if (icon) {
      icon.classList.replace("fa-caret-right", "fa-caret-down");
    }
    if (dottedIcon) dottedIcon.classList.add("hiddenClass");
  }
}

//add caret-right icon
function setCaretIconRight(node) {
  if (node.children.length > 0) {
    const icon = node.el.querySelector(".fas");
    if (icon) {
      icon.classList.replace("fa-caret-down", "fa-caret-right");
    }
    const dottedIcon = node.el.querySelector(".json-size");
    if (dottedIcon) dottedIcon.classList.remove("hiddenClass");
  }
}

// toggle node if node is already expanded or vice-versa
function toggleNode(node) {
  if (node.isExpanded) {
    node.isExpanded = false;
    setCaretIconRight(node);
    hideNodeChildren(node);
  } else {
    node.isExpanded = true;
    setCaretIconDown(node);
    showNodeChildren(node);
  }
}

//find data type of a node
function getDataType(val) {
  if (Array.isArray(val)) return "array";
  if (val === null) return "null";
  return typeof val;
}

// main function to perform functionality
function createNodeElement(node) {
  let el = document.createElement("div");

  const getTypeString = (node) => {
    if (node.type === "array") return `[...]`;
    if (node.type === "object") return `{...}`;
    return null;
  };

  if (node.children.length > 0) {
    el.innerHTML = expandedTemplate({
      key: node.key,
      strType: getTypeString(node),
    });
    const caretEl = el.querySelector(".caret-icon");
    node.dispose = caretEl?.addEventListener("click", () => toggleNode(node));
    caretEl.removeEventListener("click", () => toggleNode(node));
  } else {
    el.innerHTML = notExpandedTemplate({
      key: node.key,
      value: node.value,
      type: typeof node.value,
      parent: node.parent,
    });
  }

  const lineEl = el.children[0];

  if (node.parent !== null) {
    lineEl.classList.add("hiddenClass");
  }

  lineEl.style = "margin-left: " + node.depth * 18 + "px;";

  return lineEl;
}

// traverse down the tree recursively
function traverse(node, callback) {
  callback(node);
  if (node.children.length > 0) {
    node.children.forEach((child) => {
      traverse(child, callback);
    });
  }
}

// create new node
function createNode(opt = {}) {
  return {
    key: opt.key || null,
    parent: opt.parent || null,
    value: opt.hasOwnProperty("value") ? opt.value : null,
    isExpanded: opt.isExpanded || false,
    type: opt.type || null,
    children: opt.children || [],
    el: opt.el || null,
    depth: opt.depth || 0,
    dispose: null,
  };
}

function createSubnode(data, node) {
  if (typeof data === "object") {
    for (let key in data) {
      const child = createNode({
        value: data[key],
        key: key,
        depth: node.depth + 1,
        type: getDataType(data[key]),
        parent: node,
      });
      node.children.push(child);
      createSubnode(data[key], child);
    }
  }
}

//parse data
function getJsonObject(data) {
  return typeof data === "string" ? JSON.parse(data) : data;
}

// create tree
export function create(jsonData) {
  const parsedData = getJsonObject(jsonData);
  const rootNode = createNode({
    value: parsedData,
    key: getDataType(parsedData),
    type: getDataType(parsedData),
  });
  createSubnode(parsedData, rootNode);
  return rootNode;
}

//render tree on targeted element
export function render(tree, targetElement) {
  const containerEl = createContainerElement();

  traverse(tree, function (node) {
    node.el = createNodeElement(node);
    containerEl.appendChild(node.el);
  });

  targetElement.appendChild(containerEl);
}

export default {
  render,
  create,
  traverse,
};
