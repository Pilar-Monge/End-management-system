const { DecisionTreeClassifier } = require('ml-cart'); 
try {
  console.log(DecisionTreeClassifier.load({ name: 'DecisionTreeClassifier', root: { splitColumn: 0, splitValue: 25, left: { value: 'REJECT' }, right: { value: 'ACCEPT' } } }));
} catch (e) {
  console.error(e.message);
}
