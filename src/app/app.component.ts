import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Data, DataClean, GraphData, HumanData } from './models/data';
import {Subscription, of} from 'rxjs'
import { mergeMap } from 'rxjs/operators'
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

  arrayDOCS:GraphData[] = []
  subscribe!:Subscription

  arrayData:HumanData[]=[]

  constructor(
    private http: HttpClient
  ) { }


  getSpartQL2(){
    const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX bibo: <http://purl.org/ontology/bibo/>
    select ?data where {
      ?data rdf:type bibo:AcademicArticle .
    } limit 100 `
    const fullUrl = this.endpointUrl2 + '?query=' + encodeURIComponent(query)
    const headers = { 'Accept': 'application/sparql-results+json', }
    console.log(fullUrl)
    return this.http.get(fullUrl, { headers: headers }).subscribe((res:any)=>{
      const data = res.results.bindings  as GraphData[]
      this.arrayDOCS =  data
      console.log(this.arrayDOCS)
    }
    )
  }

  getSparql() {
    const sparqlQuery = `
          SELECT ?humanos ?humanosLabel
          WHERE
          {
            ?humanos wdt:P27 ${this.country.uri}.
             SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
          }limit 100`
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json', }
    console.log(sparqlQuery)
    return this.http.get(fullUrl, { headers: headers }).pipe(
      mergeMap((res:any)=>{
        console.log(res)
        const data = res.results.bindings as HumanData[]
        return of(data)
      })
    )
  }

  handleCountry(event: DataClean) {
    //console.log('pais', event.uri)
    this.country = event
    if(this.subscribe){
      this.subscribe.unsubscribe()
    }
    console.log(this.country)
    this.subscribe = this.getSparql().subscribe(res=>{
      this.arrayData=res
    })
    //console.log(this.subscribe)
  }
  ngOnInit(): void {
    this.getSpartQL2()
  }
}
