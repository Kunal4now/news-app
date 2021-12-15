import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'

export class News extends Component {
    static defaultProps = {
        country: "in",
        pageSize: 8,
        category: "general"
    }
    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }
    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }
    constructor(props) {
        super(props);
        this.state = {
            articles: ["dfd"],
            loading: false,
            page: 1
        };
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`
    }

    updateNews = async () => {
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apikey=5f64c36daba34857a3c047d7fbcdfd9c&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true})
        let data = await fetch(url)
        let parsedData = await data.json();
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false
        });
    }

    async componentDidMount() {
        this.updateNews()
    }

    handleNextClick = async () => {
        this.updateNews()
        this.setState({
            page: this.state.page + 1
        })
    }

    handlePrevClick = async () => {
        this.updateNews()
        this.setState({
            page: this.state.page -1
        })
    }

    render() {
        console.log("render")
        return (    
            <div className = "container my-3">  
                <h1 className = "text-center">{`NewsMonkey - Top ${this.capitalizeFirstLetter(this.props.category)} Headlines`}</h1>
                {this.state.loading && <Spinner/>}
                <div className="row">
                    {!this.state.loading && this.state.articles.map((element)=>{
                        return <div className="col-md-3" key={element.url}>
                        <NewsItem title={element.title?element.title.slice(0, 45):""} description={element.description?element.description.slice(0, 88):""} imageUrl={!element.urlToImage ? "https://di5qs4dv32t01.cloudfront.net/wp-content/uploads/2021/12/Omi.jpg" : element.urlToImage} newsUrl={element.url} author = {element.author} publishedAt = {element.publishedAt} />
                        </div>
                    })}
                </div>
                <div className="container d-flex justify-content-between">
                    <button className="btn btn-dark" disabled = {this.state.page <= 1} onClick = {this.handlePrevClick}>Previous</button>
                    <button className="btn btn-dark" disabled = {this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} onClick = {this.handleNextClick}>Next</button>
                </div>
            </div>
        )
    }
}

export default News