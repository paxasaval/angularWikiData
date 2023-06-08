import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Data, DataClean, HumanData } from './models/data';
import {Subscription, of} from 'rxjs'
import { mergeMap } from 'rxjs/operators'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'paxaWiki2';
  country!: DataClean
  endpointUrl = 'https://query.wikidata.org/sparql';
  subscribe!:Subscription

  arrayData:HumanData[]=[]

  constructor(
    private http: HttpClient
  ) { }

  getSparql() {
    const sparqlQuery = `
          SELECT ?humanos ?humanosLabel
          WHERE
          {
            ?humanos wdt:P27 ${this.country.uri}.
             SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
          }limit 100`
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }
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

}
