module.exports=((ATA)=>{
	try{
	const Search_Regex = (text, regex)=>{
		if(!regex.test(text))return{};
		const match = regex.exec(text);
		const stack = {};
		Object.keys(match.groups).map((key)=>{
			stack[key] = match.groups[key] || "";
		});
		return stack;
	};
	/*
		/^
			(
				?<value1>(regular1)
			)
			(
				?<value2>(regular2)
			)
		$/gi
		
	*/
	const URL_Parse = (url)=>{
		url = url + "";
		
		const { protocol, domain, port, path } = Search_Regex(url, /^(?<all>((((?<protocol>([a-zA-Z0-9]+)):)?\/\/)(?<domain>([a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*))(:(?<port>(\d+)))?(?<path>(\/(.*)))?))$/);
		
		const { filepath, hash } = Search_Regex(domain ? path : url, /(?<all>((?<filepath>([a-zA-Z0-9_.-]*(\/[a-zA-Z0-9_.-]+)*))(?<hash>(#(.+)))?))$/);
		
		const { directory, filename, extension } = Search_Regex(filepath || path || url, /^(?<all>((?<directory>((\/)?([a-zA-Z0-9_.-]+\/)*))?(?<filename>((([a-zA-Z0-9_-]+\.)+)?(?<extension>([a-zA-Z0-9_-]+))))))$/);
		
		return{
			url,
			directory,
			filepath,
			hash,
			protocol, domain, port, path,
			filename, extension
		};
		
		const split0 = url.split("#");
		//const hash = split0[1] || "";
		const split1 = split0[0].split("?");
		const query = split1[1] || "";
		const url1 = split1[0];//.split("//");
		
		console.log(url1);
		
		
		return{
			protocol, domain, port, path,
			url,
			url1,
			hash,
			query,
			filename,
			extension,
			//protocol,
			
		};
	};
	
	
	
	
	return{
		URL_Parse,
		
	};
	
	}catch(e){console.log("MODULEEE => ", e);}
})(ATA());