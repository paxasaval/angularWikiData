import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthorData, GraphData, HumanCelebreData, HumanData, HumanDetailData, Item, ItemLabel, WikiData } from 'src/app/models/data';
import { Subscription, concatMap, from, map, mergeMap, of, toArray } from 'rxjs'
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
@Component({
  selector: 'app-card-human',
  templateUrl: './card-human.component.html',
  styleUrls: ['./card-human.component.css']
})
export class CardHumanComponent implements OnInit, OnChanges {

  @Input() human!: HumanData
  @Input() data!: GraphData

  humanDetail!: HumanDetailData
  endpointUrl = environment.endpointUrl2;
  endpointUrl2 = environment.endpointUrl

  subscribe!: Subscription
  arrayProfesion: HumanCelebreData[] = []
  subscribeName!: Subscription
  name!: ItemLabel
  subscribeLastName!: Subscription
  lastName!: ItemLabel
  subscribeImage!: Subscription
  image!: Item | null
  subscribeDate!: Subscription
  dateBirth!: ItemLabel | Item
  subscribeDateDeath!: Subscription
  dateDeath!: ItemLabel | Item
  //
  subscribeTitle!: Subscription
  title!: GraphData
  subscribeKeyword!: Subscription
  keywords!: GraphData[]
  subscribeDOI!: Subscription
  doi!: GraphData
  subsscriptionAuthor!: Subscription
  authors!: AuthorData[]
  subscriptionLink!: Subscription
  link!: GraphData
  //
  authorsToShow: AuthorData[] = []
  showAllAuthors = false

  arrayTag: Map<string, string> = new Map()
  tags!: [string, string][]

  flagDeath = false
  flagTag = false
  constructor(
    private http: HttpClient

  ) { }

  /*   getName(){
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
            }`
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
    } */
  //Fin seccion human data

  //
  getTitle() {
    const sparqlQuery = `
    PREFIX dcterms: <http://purl.org/dc/terms/>
    select ?data where {
      <${this.data.data.value}> dcterms:title ?data .
    } limit 100 `
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }
    return this.http.get<WikiData>(fullUrl, { headers: headers })
  }
  getKeywords() {
    const sparqlQuery = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX bibo: <http://purl.org/ontology/bibo/>
    PREFIX dc: <http://purl.org/dc/elements/1.1>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    select ?data where {
	<${this.data.data.value}> dcterms:subject ?keyword .
    ?keyword skos:prefLabel ?data
} limit 100`
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }
    //console.log(sparqlQuery)
    return this.http.get<WikiData>(fullUrl, { headers: headers })
  }

  getExtraInfo(word: string) {
    const sparqlQuery = `
    SELECT * WHERE {
      ?data rdfs:label '${word}'@en.
      OPTIONAL {
        ?data wdt:P373 '${word}'.
        ?data wdt:P3417 '${word}'.
        ?data wdt:P9084 '${word}'
      }
    }`
    const fullUrl = this.endpointUrl2 + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }
    //console.log(sparqlQuery)
    return this.http.get<WikiData>(fullUrl, { headers: headers })
  }

  getDOI() {
    const sparqlQuery = `
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX bibo: <http://purl.org/ontology/bibo/>
    select ?data where {
      <${this.data.data.value}> bibo:doi ?data.
    } limit 100 `
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }
    //console.log(sparqlQuery)
    return this.http.get<WikiData>(fullUrl, { headers: headers })
  }
  //Authors
  getAuthors() {
    const sparqlQuery = `PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX bibo: <http://purl.org/ontology/bibo/>
    PREFIX vivo: <http://vivoweb.org/ontology/core#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    select ?data ?id where {
          <${this.data.data.value}> vivo:relatedBy ?authorship.
        ?authorship vivo:relates ?author_uri.
        ?author_uri foaf:name ?data.
        ?author_uri dcterms:identifier ?id
        } limit 100 `
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }
    //console.log(sparqlQuery)
    return this.http.get<WikiData>(fullUrl, { headers: headers })
  }

  toggleShowAll() {
    if (!this.showAllAuthors) {
      this.authorsToShow = this.authors
      this.showAllAuthors = true
    } else {
      this.authorsToShow = this.authors.slice(0, 3)
      this.showAllAuthors = false
    }

  }

  //fin authors
  getLink() {
    const sparqlQuery = `
    PREFIX rss: <http://purl.org/rss/1.0/>
    select ?data where {
          <${this.data.data.value}> rss:link ?data
        } limit 100   `
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { 'Accept': 'application/sparql-results+json' }
    //console.log(sparqlQuery)
    return this.http.get<WikiData>(fullUrl, { headers: headers })
  }

  //Fin seccion data graphDB



  ngOnChanges(changes: SimpleChanges): void {
    if (this.subscribe) {
      this.subscribe.unsubscribe()
    }
    if (this.subscribeImage) {
      this.subscribeName.unsubscribe()
    }
    if (this.subscribeDate) {
      this.subscribeDate.unsubscribe()
    }
    if (this.subscribeDateDeath) {
      this.subscribeDateDeath.unsubscribe()
    }
    if (this.subscribeTitle) {
      this.subscribeTitle.unsubscribe()
    }
    if (this.subscribeKeyword) {
      this.subscribeKeyword.unsubscribe()
    }
    if (this.subscribeDOI) {
      this.subscribeDOI.unsubscribe()
    }
    if (this.subsscriptionAuthor) {
      this.subsscriptionAuthor.unsubscribe()
    }

    /*       this.subscribeDate=this.getDateBirth().subscribe(res=>{
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
          }) */
    this.subscribeTitle = this.getTitle().subscribe(res => {
      this.title = res.results.bindings[0] as GraphData
    })
    this.subscribeKeyword = this.getKeywords().pipe(
      concatMap(keywords => {
        const kewordsBD = keywords.results.bindings as GraphData[]
        const words = kewordsBD.map(k => {
          return k.data.value
        })
        return from(words).pipe(
          concatMap(word => {
            this.arrayTag.set(word, '#')
            return this.getExtraInfo(word).pipe(
              map(res => {
                const object = res.results.bindings[0]
                //console.log(object)
                const value = object ? object.data.value : ''
                this.arrayTag.set(word, value)
                return this.arrayTag
              }),
              catchError(error => {
                console.error('Error al obtener palabras clave:', error);
                return of(this.arrayTag);
              })
            )
          })
        )
      })
    ).subscribe(res => {
      this.tags = Array.from(res)
      this.flagTag = true
      //  console.log(this.tags)
    }, error => {
      // Manejo del error en caso de que ocurra en la suscripción final.
      console.error('Error en la suscripción:', error);
    })

    this.subscribeDOI = this.getDOI().subscribe(res => {
      this.doi = res.results.bindings[0] as GraphData
      //    console.log(res)
    })
    this.subsscriptionAuthor = this.getAuthors().subscribe(res => {
      this.authors = res.results.bindings as AuthorData[]
      this.authorsToShow = this.authors.slice(0, 3)
    })
    this.subscriptionLink = this.getLink().subscribe(res => {
      this.link = res.results.bindings[0] as GraphData
    })

  }

  ngOnInit(): void {

  }

}
