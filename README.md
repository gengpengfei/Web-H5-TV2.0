navigation 使用方法

id:''
selector: '',
straightOnly: false,
straightOverlapThreshold: 0.5,
rememberSource: false,
disabled: false,
defaultElement: '',
enterTo: '',
leaveFor: null,
restrict: 'self-first',
tabIndexIgnoreList: 'a, input, select, textarea, button, iframe, [contentEditable=true]',
navigableFilter: null

id
类型：string
说明：导航id

selector
类型：选择器
默认： ''
说明：元素匹配selector在SpatialNavigation中被视为可导航元素。但是，隐藏或禁用的元素将被忽略，因为它们无法以任何方式聚焦。

straightOnly
类型：布尔
默认： false
说明：当为时true，将仅导航直线（垂直或水平）方向上的元素。即SpatialNavigation会忽略倾斜方向上的元素。

straightOverlapThreshold
类型：[0，1]范围内的数字
默认： 0.5
说明：该阈值用于确定在直（垂直或水平）方向上是否考虑元素。有效数字在0到1.0之间。将其设置为0.3意味着仅当元素与笔直区域重叠至少其总面积的0.3倍时，才沿笔直方向计数。

rememberSource
类型：布尔
默认：false
说明：如果为true，则先前关注的元素将具有较高的优先级，以被选为下一个候选对象。

disabled
类型：布尔
默认：false
说明：如果为true，则本节中定义的元素不可导航。此属性也被disable()和修改enable()。

defaultElement
类型：选择器（不带@语法）
默认： ''
说明：当某个部分被指定为下一个关注目标时（例如focus('some-section-id')被调用），将首先defaultElement选择该部分中匹配的第一个元素。

enterTo
类型：''，'last-focused'或'default-element'
默认：''
说明：如果焦点来自另一个部分，则可以定义该部分中的哪个元素应首先聚焦。
'last-focused'表示我们上次离开本节之前的最后关注的元素。如果本节尚未重点介绍，那么接下来将选择默认元素（如果有）。
'default-element'表示中定义的元素defaultElement。
'' （空字符串）表示遵循原始规则，无需进行任何更改。

leaveFor
类型：null或PlainObject
默认： null
说明：此属性指定当用户按下相应的箭头键并打算离开当前部分时，下一个应聚焦的元素。
这应该是一个PlainObject包括四个属性：'left'，'right'，'up'和'down'。每个属性都应该是一个Selector。这些属性中的任何一个都可以省略，并且SpatialNavigation将遵循原始规则进行导航。

restrict
类型：'self-first'，'self-only'或'none'
默认： 'self-first'
'self-first' 意味着同一部分中的元素将具有更高的优先级，以被选作下一个候选者。
'self-only'表示其他部分中的元素将永远无法通过箭头键进行导航。（但是，您始终可以通过focus()手动调用来集中注意它们。）
'none' 没有任何限制。

tabIndexIgnoreList
类型：字符串
默认： 'a, input, select, textarea, button, iframe, [contentEditable=true]'
说明：元素匹配tabIndexIgnoreList永远不会受到的影响makeFocusable()。通常用于忽略已经聚焦的元素。

navigableFilter
类型：'null'或function(HTMLElement)
默认： null
说明：接受DOM元素作为第一个参数的回调函数，每当SpatialNavigation尝试遍历每个候选对象时，都会调用此函数。您可以通过返回忽略任意元素false。

