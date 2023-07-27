import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Data, DataClean } from 'src/app/models/data';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-select-contry',
  templateUrl: './select-contry.component.html',
  styleUrls: ['./select-contry.component.css']
})
export class SelectContryComponent implements OnInit {

  selectValue!: DataClean

  arrayCountries:DataClean[]=[]
  @Output() selectCountry = new EventEmitter<DataClean>();
  endpointUrl = 'https://query.wikidata.org/sparql';
  sparqlQuery = `
SELECT ?item ?itemLabel
WHERE
{
  ?item wdt:P31 wd:Q6256.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
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
      const data = res.results.bindings as Data[]
      const arrayData = data.map(d=>{
        const uri = '<'+d.item.value+'>'
        const value = d.itemLabel.value
        const dClean:DataClean={uri,value}
        return dClean
      })
      this.arrayCountries=arrayData

    })
  }


}
