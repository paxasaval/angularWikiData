import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import { DataClean, DataURI } from 'src/app/models/data';
import { environment } from 'src/environments/environment';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-select-ocupation',
  templateUrl: './select-ocupation.component.html',
  styleUrls: ['./select-ocupation.component.css']
})
export class SelectOcupationComponent implements OnInit {

  selectValue!: DataClean

  arrayCountries: DataClean[] = []
  //@Output() selectCountry = new EventEmitter<DataClean>();
  endpointUrl = environment.endpointUrl2;
  sparqlQuery = ``
  inputSearch = ''

  constructor(
    private http: HttpClient
  ) { }

  countryEmit(value: DataClean) {
  }

  getSearchQuery(word: string) {
    const query = `
  PREFIX dcterms: <http://purl.org/dc/terms/>
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  PREFIX vivo: <http://vivoweb.org/ontology/core#>
  SELECT DISTINCT ?doi_uri ?o
  WHERE {
      {
        ?doi_uri dcterms:title ?o .
      }
      UNION
      {
	      ?doi_uri dcterms:subject ?key_uri .
        ?key_uri skos:prefLabel ?o.
	    }
      UNION
      {
        ?doi_uri vivo:relatedBy ?authorship.
        ?authorship vivo:relates ?author_uri.
        ?author_uri foaf:name ?o.
	    }
      FILTER(CONTAINS(LCASE(STR(?o)), "${word}"))
    }LIMIT 10
    `
    return query
  }

  search(){
    const query = this.getSearchQuery(this.inputSearch)
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query)
    const headers = { 'Accept': 'application/sparql-results+json' }
    this.http.get(fullUrl, { headers: headers })
  }



  query() {
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(this.sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }
    return this.http.get(fullUrl, { headers: headers })
  }

  ngOnInit(): void {
    this.query().subscribe((res: any) => {
      console.log(res)
      const data = res.results.bindings as DataURI[]
      const arrayData = data.map(d => {
        const uri = '<' + d.uri.value + '>'
        const value = d.data.value
        const dClean: DataClean = { uri, value }
        return dClean
      })
      this.arrayCountries = arrayData
      console.log(this.arrayCountries)
    })
  }

}
