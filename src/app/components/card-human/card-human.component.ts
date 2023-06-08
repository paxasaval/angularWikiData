import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HumanCelebreData, HumanData, HumanDetailData, Item, ItemLabel, WikiData } from 'src/app/models/data';
import { Subscription, of } from 'rxjs'

@Component({
  selector: 'app-card-human',
  templateUrl: './card-human.component.html',
  styleUrls: ['./card-human.component.css']
})
export class CardHumanComponent implements OnInit,OnChanges {

  @Input() human!: HumanData
  humanDetail!:HumanDetailData
  endpointUrl = 'https://query.wikidata.org/sparql';
  subscribe!: Subscription
  arrayProfesion:HumanCelebreData[]=[]
  subscribeName!: Subscription
  name!:ItemLabel
  subscribeLastName!: Subscription
  lastName!:ItemLabel
  subscribeImage!: Subscription
  image!:Item|null
  subscribeDate!:Subscription
  dateBirth!:ItemLabel|Item
  subscribeDateDeath!:Subscription
  dateDeath!:ItemLabel|Item
  flagDeath=false
  constructor(
    private http: HttpClient

  ) { }

  getName(){
    const sparqlQuery = `
          SELECT ?humanos ?humanosLabel ?nameLabel ?lastNameLabel ?image
          WHERE
          {
            <${this.human.humanos.value}> wdt:P735 ?name.
             SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
          }limit 100`
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }
    return this.http.get<WikiData>(fullUrl,{headers:headers})
  }
  getLastName(){
    const sparqlQuery = `
          SELECT ?humanos ?humanosLabel ?nameLabel ?lastNameLabel ?image
          WHERE
          {
            <${this.human.humanos.value}> wdt:P734 ?lastName.
             SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
          }limit 100`
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }
    return this.http.get<WikiData>(fullUrl,{headers:headers})
  }
  getImage(){
    const sparqlQuery = `
          SELECT ?humanos ?humanosLabel ?nameLabel ?lastNameLabel ?image
          WHERE
          {
            <${this.human.humanos.value}> wdt:P18 ?image.
             SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
          }limit 100`
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }
    return this.http.get<WikiData>(fullUrl,{headers:headers})
  }
  getDateBirth(){
    const sparqlQuery = `
          SELECT ?date ?dateLabel
          WHERE
          {
            <${this.human.humanos.value}> wdt:P569 ?date.
             SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
          }limit 100`
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }
    return this.http.get<WikiData>(fullUrl,{headers:headers})
  }
  getDateDeath(){
    const sparqlQuery = `
          SELECT ?date ?dateLabel
          WHERE
          {
            <${this.human.humanos.value}> wdt:P570 ?date.
             SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
          }limit 100`
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }
    return this.http.get<WikiData>(fullUrl,{headers:headers})
  }

  getSparQl() {
    const sparqlQuery = `
          SELECT ?humanos ?humanosLabel ?profesion ?profesionLabel
          WHERE
          {
            <${this.human.humanos.value}> wdt:P106 ?profesion.
             SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
          }limit 100`
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }
    return this.http.get<WikiData>(fullUrl,{headers:headers})
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(this.subscribe){
        this.subscribe.unsubscribe()
      }
      if(this.subscribeImage){
        this.subscribeName.unsubscribe()
      }
      if(this.subscribeDate){
        this.subscribeDate.unsubscribe()
      }
      if(this.subscribeDateDeath){
        this.subscribeDateDeath.unsubscribe()
      }
      this.subscribeDate=this.getDateBirth().subscribe(res=>{
        this.dateBirth=res.results.bindings[0].date
      })
      this.subscribeDateDeath=this.getDateDeath().subscribe(res=>{
        if(res.results.bindings.length>0){
          this.dateDeath=res.results.bindings[0].date
        }else{
          this.flagDeath=true
        }
      })
      this.subscribeImage=this.getImage().subscribe(res=>{
        if(res.results.bindings.length>0){
          this.image=res.results.bindings[0].image as Item
        }else{
          this.image=null
        }
        console.log(this.image)
      })
      this.subscribe=this.getSparQl().subscribe(res=>{
        this.arrayProfesion = res.results.bindings as HumanCelebreData[]
      })
  }

  ngOnInit(): void {

  }

}
