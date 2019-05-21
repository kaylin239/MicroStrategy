function transformingTreeJsonToGridData(originJson) {
  let gridData = []

  if (originJson && originJson.result && originJson.result.definition && originJson.result.data) {
    let data = originJson.result.data
    let definition = originJson.result.definition
    let attributes = definition.attributes
    let metrics = definition.metrics

    if ((!attributes || attributes.length === 0) && (!metrics || metrics.length === 0)) {
      return gridData
    }

    let attributeFormInfos = []
    let metricInfos = []
    //collect attributeForms info
    attributeFormInfos = attributes.flatMap(attribute => {
      return attribute.forms ? attribute.forms.map(form => attribute.name + '@' + form.name) : attribute.name
    })

    //collect metrics info
    metricInfos = metrics.map(metric => metric.name)

    const headerTittleRow = [...attributeFormInfos, metricInfos]
    gridData.push(headerTittleRow)


    let dataCellRow = []
    if (data.root) {
      deepVisitTree(data.root, gridData, dataCellRow)
    }

  }

  return gridData
}

/**
 * Algorithm: backtracking 
 * deep visit tree to construct grid data from tree json 
 * @param {*} node 
 * @param {*} gridData 
 * @param {*} row 
 */
function deepVisitTree(node, gridData, row) {
  if (!node) {
    const newRow = row.slice()
    gridData.push(newRow)
    return
  }

  let children = node.children
  let element = node.element
  let metrics = node.metrics

  let formNames = null
  if (element) {
    if (element.formValues) {
      //multi-form: add the attribute form values to row
      let formValueMap = element.formValues
      formNames = Object.keys(formValueMap)
      row = row.concat(formNames.map(formName => formValueMap[formName]))
    } else {
      row.push(element.name)
    }
  }


  if (metrics) { //if metric exists, need handle metric value
    //add the metric values to row
    for (let index in metrics) {
      row.push(metrics[index].rv)
    }
  }

  if (!children) {
    children = new Array()
    children.push(null)
  }
  for (let childindex in children) {
    deepVisitTree(children[childindex], gridData, row)
  }

  if (metrics) { //if metric exists, here need to pop metric value from row
    for (let index in metrics) {
      row.pop()
    }
  }

  if (element) {//if attribute forms exists, here need to pop attribute forms from row
    if (formNames) {
      formNames.forEach((formName, i) => {
        row.pop()
      })
    } else {
      row.pop()
    }
  }

}

/**
 * create table base on transformed cube/report grid data
 */
function autoCreateTable(gridData, div) {
  if (!gridData || gridData.length === 0) return

  let table = document.createElement("table")
  table.setAttribute("border", "1")
  table.setAttribute("background", "red")

  let line = gridData.length
  let list = gridData[0].length
  for (let i = 0 ; i < line; i++) {
    let tr = document.createElement("tr")
    for (let j = 0 ; j < list; j++) {
      let td = document.createElement("td")
      td.innerHTML = gridData[i][j]
      tr.appendChild(td)
    }
    table.appendChild(tr)
  }
  div.appendChild(table)
}

function displayGridDataInTable(originTreeJson, div) {
  let gridData = transformingTreeJsonToGridData(originTreeJson)
  console.log('gird data is:', gridData)
  //show grid data in a table
  autoCreateTable(gridData, div)
}


 