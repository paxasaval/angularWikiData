import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Data, DataClean, DataURI } from 'src/app/models/data';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-contry',
  templateUrl: './select-contry.component.html',
  styleUrls: ['./select-contry.component.css']
})
export class SelectContryComponent implements OnInit {

  selectValue!: DataClean

  arrayCountries:DataClean[]=[]
  @Output() selectCountry = new EventEmitter<DataClean>();
  endpointUrl = environment.endpointUrl2;
  sparqlQuery = `
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  select ?data ?uri where {
        ?uri rdf:type skos:Concept.
      ?uri skos:prefLabel ?data
  }`
  constructor(
    private http: HttpClient
  ) { }

  countryEmit(value: DataClean) {
    this.selectCountry.emit(value)
  }

  query(){
    const fullUrl = this.endpointUrl + '?query='+encodeURIComponent(this.sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }
    return this.http.get(fullUrl,{headers:headers})
  }

  ngOnInit(): void {
    this.query().subscribe((res:any)=>{
      console.log(res)
      const data = res.results.bindings as DataURI[]
      const arrayData = data.map(d=>{
        const uri = '<'+d.uri.value+'>'
        const value = d.data.value
        const dClean:DataClean={uri,value}
        return dClean
      })
      this.arrayCountries=arrayData
      console.log(this.arrayCountries)
    })
  }


}
