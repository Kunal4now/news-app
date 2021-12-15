import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';

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
            articles: [],
            loading: false,
            page: 1,
            totalResults: 0
        };
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`
    }

    updateNews = async () => {
        this.props.setProgress(10)
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apikey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true})
        let data = await fetch(url)
        let parsedData = await data.json();
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false
        });
        this.props.setProgress(100)
    }

    async componentDidMount() {
        this.updateNews()
    }

    fetchMoreData = async () => {
        this.setState({page: this.state.page + 1})
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apikey=5f64c36daba34857a3c047d7fbcdfd9c&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        let data = await fetch(url)
        let parsedData = await data.json();
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults,
        });
        this.props.setProgress(100)
    }

    render() {
        console.log("render")
        return (    
            <>
            <h1 className = "text-center">{`NewsMonkey - Top ${this.capitalizeFirstLetter(this.props.category)} Headlines`}</h1>
            {this.state.loading && <Spinner/>}
            <InfiniteScroll
                dataLength={this.state.articles.length}
                next={this.fetchMoreData}
                hasMore={this.state.articles.length !== this.state.totalResults}
                loader={<Spinner/>}
            >
                <div className="container">
                    <div className="row my-3"> 
                        {this.state.articles.map((element, idx)=>{
                            return <div className="col-md-4" key={idx}>
                            <NewsItem title={element.title?element.title.slice(0, 45):""} description={element.description?element.description.slice(0, 88):""} imageUrl={!element.urlToImage ? "https://di5qs4dv32t01.cloudfront.net/wp-content/uploads/2021/12/Omi.jpg" : element.urlToImage} newsUrl={element.url} author = {element.author} publishedAt = {element.publishedAt} />
                            </div>
                        })}
                    </div>
                </div>
            </InfiniteScroll>
            </>
        )
    }
}

export default News