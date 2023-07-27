export interface Item{
  type:string,
  value:string
}
export interface ItemLabel{
  'xml:lang':string,
  type:string,
  value:string
}
export interface Data{
  item:Item,
  itemLabel:ItemLabel
}
export interface DataClean{
  uri:string,
  value:string
}
export interface HumanData{
  humanos:Item,
  humanosLabel:ItemLabel,
}

export interface HumanDetailData{
  nameLabel?:ItemLabel,
  lastNameLabel?:ItemLabel,
  image?:Item,
}

export interface HumanCelebreData{
  profesion:Item,
  profesionLabel:ItemLabel,
}
export interface WikiData{
  head:{vars:string[]},
  results:{bindings:any[]}
}

export interface GraphData{
  data:{type:string,value:string}
}
