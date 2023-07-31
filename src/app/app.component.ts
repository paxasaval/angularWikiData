import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Data, DataClean, GraphData, HumanData } from './models/data';
import { Subscription, of } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'paxaWiki2';
  country!: DataClean
  endpointUrl = 'https://query.wikidata.org/sparql';
  endpointUrl2 = 'http://localhost:7200/repositories/domains';

  arrayDOCS: GraphData[] = []
  subscribe!: Subscription
  flag=false
  arrayData: HumanData[] = []
  //cloud keyyword
  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the width of the upper element multiplied by the value
    width: 1000,
    // if height is between 0 and 1 it will be set to the height of the upper element multiplied by the value
    height: 400,
    overflow: false,

  };
  data: CloudData[] = [
    { text: 'Initial Data weight-10', weight: 10 }
  ];
  count=10
  page=0
  prevPage=-1
  nextPage=1

  arrayKeywords!:[string,number][]
  subscribeKeywords!: Subscription


  constructor(
    private http: HttpClient
  ) { }


  getSpartQL2() {
    const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX bibo: <http://purl.org/ontology/bibo/>
    select ?data where {
      ?data rdf:type bibo:AcademicArticle .
    } limit 100 `
    const fullUrl = this.endpointUrl2 + '?query=' + encodeURIComponent(query)
    const headers = { 'Accept': 'application/sparql-results+json', }
    console.log(fullUrl)
    return this.http.get(fullUrl, { headers: headers }).subscribe((res: any) => {
      const data = res.results.bindings as GraphData[]
      this.arrayDOCS = data
      console.log(this.arrayDOCS)
    }
    )
  }

  getKeywords() {
    const query = `PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    select ?data where {
          ?doi_uri dcterms:subject ?keyword_uri.
        ?keyword_uri skos:prefLabel ?data
        }`
    const fullUrl = this.endpointUrl2 + '?query=' + encodeURIComponent(query)
    const headers = { 'Accept': 'application/sparql-results+json', }
    console.log(fullUrl)
    return this.http.get(fullUrl, { headers: headers }).subscribe((res: any) => {
      const data = res.results.bindings as GraphData[]
      this.arrayKeywords = this.getCalculateFrecuncy(data)
      this.fetchCloud(this.arrayKeywords)
    }
    )
  }

  fetchCloud(array:[string,number][]){
    this.data=[]
    const subArray = array.slice(0,100)
    subArray.forEach(word=>{
      this.data.push({
        text:word[0],
        weight:word[1],
      })
    })
    console.log(this.data)
    this.flag=true
  }

  getCalculateFrecuncy(arrayKeywords: GraphData[]){
    const result:Map<string,number> = new Map()

    arrayKeywords.forEach(keyword=>{
      const word = keyword.data.value
      if(result.has(word)){
        result.set(word, result.get(word)!+1)
      }else{
        result.set(word,1)
      }
    })
    const arrayResult:[string,number][]=Array.from(result)

    return arrayResult.sort((a,b)=>b[1]-a[1])
  }

  getSparql() {
    const sparqlQuery = `
    PREFIX dcterms: <http://purl.org/dc/terms/>
    select ?data where {
          ?data dcterms:subject ${this.country.uri}
    }
    limit 10
    offset ${10*this.page}
    `
    const fullUrl = this.endpointUrl2 + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json', }
    console.log(sparqlQuery)
    return this.http.get(fullUrl, { headers: headers }).subscribe((res:any)=>{
      const data = res.results.bindings as GraphData[]
      this.arrayDOCS = data
      if(this.arrayDOCS.length<10){
        console.log('asd')
        this.nextPage=-1
      }else{
        this.nextPage=this.page+1
      }
    })
  }

  handleNextPage(){
    this.prevPage=this.page
    this.page+=1
    this.nextPage=this.page+1
    if (this.subscribe) {
      this.subscribe.unsubscribe()
    }
    this.subscribe = this.getSparql()
  }
  handlePrevPage(){
    this.nextPage=this.page
    this.page-=1
    this.prevPage=this.page-1
    if (this.subscribe) {
      this.subscribe.unsubscribe()
    }
    this.subscribe = this.getSparql()
  }

  handleCountry(event: DataClean) {
    //console.log('pais', event.uri)
    this.country = event
    if (this.subscribe) {
      this.subscribe.unsubscribe()
    }
    console.log(this.country)
    this.subscribe = this.getSparql()

    //console.log(this.subscribe)
  }
  ngOnInit(): void {
    //this.getSparql()
    this.getKeywords()
    console.log(this.arrayKeywords)

  }
}
