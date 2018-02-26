import React from 'react';

require('./partners.scss');

function getLogo(name) {
  return <img src={require(`../../../../images/partners-logos/${name}@2x.png`)} />
}
const Partners = () => {
  return (
    <div className={"partners"}>
      <p className={"title"}>השותפים שלנו</p>
      <div className={"partners-list"}>
        {getLogo('hagar')}
        {getLogo('hatnua')}
        {getLogo('hevra')}
        {getLogo('lebinui')}
        {getLogo('maze9')}
        {getLogo('mithabrim')}
        {getLogo('sadna')}
        {getLogo('shorashim')}
        {getLogo('shtil')}
        {getLogo('sviva')}
        {getLogo('university')}
      </div>
    </div>
  )
};

export default Partners;
