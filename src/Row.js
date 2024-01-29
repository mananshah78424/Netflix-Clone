import React, { useState, useEffect } from 'react'
import YouTube from 'react-youtube';
import axios from "./axios"
import "./Row.css";
import movieTrailer from "movie-trailer"


const baseurl = "https://image.tmdb.org/t/p/original/";


function Row({ title, fetchURL, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerURL, settrailerURL] = useState("")

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchURL);
            setMovies(request.data.results);
            return request;

        }
        fetchData();
    }, [fetchURL]);
    //[] will run only once on page load
    // Whatever you mention or include from outside the block of useEffect you need to mention it in []

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        }
    };
    const handleClick = (movie) => {
        if (trailerURL) {
            settrailerURL("");
        } else {
            movieTrailer(movie?.title || movie?.name || movie?.original_name || " ").then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search);
                settrailerURL(urlParams.get('v'));
            }).catch((error) => console.log(error))
        }
    }
    console.table(movies);
    console.log(trailerURL);

    return (
        <div className="row">
            <h2 className="row_title">{title}</h2>
            <div className="row_posters">
                {movies.map(movie => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                        src={`${baseurl}${isLargeRow ? movie.poster_path : movie.poster_path}`}
                        alt={movie.name}></img>

                ))}
            </div>
            {trailerURL && <YouTube videoId={trailerURL} opts={opts}></YouTube>}
        </div>
    )
}

export default Row
